// Подложка «по форме», как её вырезают из акрила: контур на равном расстоянии от букв,
// внутренние углы скруглены (как от фрезы), отверстия внутри букв залиты,
// отдельные части соединены короткими перемычками в самом узком месте.
// Считается по карте расстояний (EDT Фельценшвальба) на canvas.

const INF = 1e20
const MAX_PIXELS = 320000

// Размеры в долях кегля.
const OFFSET = 0.1 // отступ контура от букв
const FILLET = 0.1 // радиус скругления внутренних углов
const BRIDGE = 0.22 // ширина перемычки
const EDGE_PX = 1.3 // толщина светлой кромки, css px

let source = null

function edt1d(f, n, d, v, z) {
  let k = 0
  v[0] = 0
  z[0] = -INF
  z[1] = INF
  for (let q = 1; q < n; q++) {
    let s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k])
    while (s <= z[k]) {
      k--
      s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k])
    }
    k++
    v[k] = q
    z[k] = s
    z[k + 1] = INF
  }
  k = 0
  for (let q = 0; q < n; q++) {
    while (z[k + 1] < q) k++
    d[q] = (q - v[k]) * (q - v[k]) + f[v[k]]
  }
}

// Квадраты расстояний до ближайшей клетки, где grid = 0.
function edt(grid, w, h) {
  const n = Math.max(w, h)
  const f = new Float64Array(n)
  const d = new Float64Array(n)
  const v = new Int32Array(n)
  const z = new Float64Array(n + 1)
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) f[y] = grid[y * w + x]
    edt1d(f, h, d, v, z)
    for (let y = 0; y < h; y++) grid[y * w + x] = d[y]
  }
  for (let y = 0; y < h; y++) {
    const row = y * w
    for (let x = 0; x < w; x++) f[x] = grid[row + x]
    edt1d(f, w, d, v, z)
    for (let x = 0; x < w; x++) grid[row + x] = d[x]
  }
  return grid
}

// Заливка от краёв: всё, что не достижимо снаружи, — внутри (в том числе «дырки» в буквах).
function fillHoles(mask, w, h) {
  const outside = new Uint8Array(w * h)
  const queue = new Int32Array(w * h)
  let tail = 0
  const push = (i) => {
    if (!mask[i] && !outside[i]) {
      outside[i] = 1
      queue[tail++] = i
    }
  }
  for (let x = 0; x < w; x++) {
    push(x)
    push((h - 1) * w + x)
  }
  for (let y = 0; y < h; y++) {
    push(y * w)
    push(y * w + w - 1)
  }
  for (let head = 0; head < tail; head++) {
    const i = queue[head]
    const x = i % w
    if (x > 0) push(i - 1)
    if (x < w - 1) push(i + 1)
    if (i >= w) push(i - w)
    if (i < w * (h - 1)) push(i + w)
  }
  for (let i = 0; i < mask.length; i++) mask[i] = outside[i] ? 0 : 1
}

// Части подложки: для каждой — точки её края (с прореживанием).
function components(mask, w, h) {
  const label = new Int32Array(w * h)
  const queue = new Int32Array(w * h)
  const parts = []
  for (let start = 0; start < mask.length; start++) {
    if (!mask[start] || label[start]) continue
    const id = parts.length + 1
    const edge = []
    let tail = 0
    label[start] = id
    queue[tail++] = start
    for (let head = 0; head < tail; head++) {
      const i = queue[head]
      const x = i % w
      const near = [x > 0 ? i - 1 : -1, x < w - 1 ? i + 1 : -1, i >= w ? i - w : -1, i < w * (h - 1) ? i + w : -1]
      let border = false
      for (const j of near) {
        if (j < 0 || !mask[j]) border = true
        else if (!label[j]) {
          label[j] = id
          queue[tail++] = j
        }
      }
      if (border) edge.push(i)
    }
    const step = Math.max(1, Math.ceil(edge.length / 400))
    parts.push(edge.filter((_, k) => k % step === 0).map((i) => [i % w, Math.floor(i / w)]))
  }
  return parts
}

// Перемычки по минимальному остовному дереву: каждая часть цепляется к ближайшей в самом узком месте.
function bridges(parts) {
  const closest = (a, b) => {
    let best = [INF, null, null]
    for (const p of a)
      for (const q of b) {
        const d = (p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2
        if (d < best[0]) best = [d, p, q]
      }
    return best
  }
  const joined = [0]
  const result = []
  while (joined.length < parts.length) {
    let best = [INF]
    for (const i of joined)
      for (let j = 0; j < parts.length; j++) {
        if (joined.includes(j)) continue
        const c = closest(parts[i], parts[j])
        if (c[0] < best[0]) best = [...c, j]
      }
    joined.push(best[3])
    result.push([best[1], best[2]])
  }
  return result
}

function stampSegment(mask, w, h, [x1, y1], [x2, y2], r) {
  const dx = x2 - x1
  const dy = y2 - y1
  const len2 = dx * dx + dy * dy || 1
  const minX = Math.max(0, Math.floor(Math.min(x1, x2) - r))
  const maxX = Math.min(w - 1, Math.ceil(Math.max(x1, x2) + r))
  const minY = Math.max(0, Math.floor(Math.min(y1, y2) - r))
  const maxY = Math.min(h - 1, Math.ceil(Math.max(y1, y2) + r))
  for (let y = minY; y <= maxY; y++)
    for (let x = minX; x <= maxX; x++) {
      const t = Math.max(0, Math.min(1, ((x - x1) * dx + (y - y1) * dy) / len2))
      const ex = x - x1 - t * dx
      const ey = y - y1 - t * dy
      if (ex * ex + ey * ey <= r * r) mask[y * w + x] = 1
    }
}

const rgb = (hex) => [1, 3, 5].map((i) => Number.parseInt(hex.slice(i, i + 2), 16))

// items — слова и логотип: строка и положение в надписи (offsetLeft/Top).
export function drawPlate(canvas, { items, width, height, fontPx, font, look }) {
  const margin = Math.round(fontPx * 0.6)
  const cw = width + margin * 2
  const ch = height + margin * 2
  let scale = Math.min(window.devicePixelRatio || 1, 2)
  if (cw * ch * scale * scale > MAX_PIXELS) scale = Math.sqrt(MAX_PIXELS / (cw * ch))
  const w = Math.ceil(cw * scale)
  const h = Math.ceil(ch * scale)
  const unit = fontPx * scale

  // 1. Буквы и логотип — силуэтом на отдельном холсте.
  source ??= document.createElement('canvas')
  source.width = w
  source.height = h
  const sctx = source.getContext('2d', { willReadFrequently: true })
  sctx.clearRect(0, 0, w, h)
  sctx.setTransform(scale, 0, 0, scale, margin * scale, margin * scale)
  sctx.font = `${font.weight || 400} ${fontPx}px ${font.family}`
  sctx.textBaseline = 'alphabetic'
  for (const it of items) {
    if (it.img) {
      if (it.img.complete) sctx.drawImage(it.img, it.x + it.img.offsetLeft, it.y + it.img.offsetTop, it.img.offsetWidth, it.img.offsetHeight)
    } else {
      const text = font.upper ? it.text.toUpperCase() : it.text
      const m = sctx.measureText(text)
      const ascent = m.fontBoundingBoxAscent ?? fontPx * 0.8
      const descent = m.fontBoundingBoxDescent ?? fontPx * 0.2
      it.baseline = it.y + (it.h - ascent - descent) / 2 + ascent
      sctx.fillText(text, it.x, it.baseline)
    }
  }
  // Пробел между словами одной строки заливаем полосой высотой со строчные буквы —
  // иначе контуры соседних слов сходятся тонкой талией. Строки между собой соединяет перемычка (шаг 3).
  const xHeight = sctx.measureText(font.upper ? 'Х' : 'х').actualBoundingBoxAscent || fontPx * 0.5
  for (let i = 1; i < items.length; i++) {
    const a = items[i - 1]
    const b = items[i]
    if (a.line !== b.line || a.img || b.img) continue
    const left = a.x + a.w - fontPx * 0.08
    sctx.fillRect(left, a.baseline - xHeight * 0.85, b.x + fontPx * 0.08 - left, xHeight * 0.85)
  }
  const alpha = sctx.getImageData(0, 0, w, h).data

  // 2. Раздуваем на отступ + радиус скругления.
  const grid = new Float64Array(w * h)
  for (let i = 0; i < grid.length; i++) grid[i] = alpha[i * 4 + 3] > 110 ? 0 : INF
  edt(grid, w, h)
  const grow = (OFFSET + FILLET) * unit
  const mask = new Uint8Array(w * h)
  for (let i = 0; i < mask.length; i++) mask[i] = grid[i] <= grow * grow ? 1 : 0

  // 3. Заливаем дырки и соединяем отдельные части.
  fillHoles(mask, w, h)
  const parts = components(mask, w, h)
  if (parts.length > 1) {
    for (const [a, b] of bridges(parts)) stampSegment(mask, w, h, a, b, (BRIDGE / 2 + FILLET) * unit)
  }

  // 4. Сжимаем обратно на радиус скругления — внутренние углы получаются круглыми.
  for (let i = 0; i < grid.length; i++) grid[i] = mask[i] ? INF : 0
  edt(grid, w, h)

  // 5. Заливка и кромка со сглаживанием по расстоянию до края.
  const fill = rgb(look.fill)
  const edge = rgb(look.edge)
  const fillA = look.fillA
  const edgeW = EDGE_PX * scale
  const shrink = FILLET * unit
  canvas.width = w
  canvas.height = h
  Object.assign(canvas.style, { left: `${-margin}px`, top: `${-margin}px`, width: `${cw}px`, height: `${ch}px` })
  const ctx = canvas.getContext('2d')
  const out = ctx.createImageData(w, h)
  const px = out.data
  for (let i = 0; i < grid.length; i++) {
    const d = Math.sqrt(grid[i]) - shrink
    if (d <= -0.5) continue
    const cover = Math.min(1, d + 0.5)
    const ring = Math.max(0, Math.min(1, edgeW - d + 0.5)) * look.edgeA
    const fa = fillA * (1 - ring)
    const a = ring + fa
    const o = i * 4
    px[o] = (edge[0] * ring + fill[0] * fa) / a
    px[o + 1] = (edge[1] * ring + fill[1] * fa) / a
    px[o + 2] = (edge[2] * ring + fill[2] * fa) / a
    px[o + 3] = a * cover * 255
  }
  ctx.putImageData(out, 0, 0)
}
