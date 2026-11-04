// Варианты и формула цены конструктора вывески.
import { NEON_COLORS } from './colors.js'
import { SIGNS } from './products.js'

// quote — цены нет на сайте, стоимость считает менеджер по макету. short — подпись на узком экране.
export const TYPES = [
  { id: 'neon', name: 'Неоновая вывеска', short: 'Неон', colorLabel: 'Цвет свечения' },
  { id: 'halo', name: 'Контражурная вывеска', short: 'Контражур', colorLabel: 'Цвет подсветки', quote: true },
  { id: 'box', name: 'Лайтбокс', colorLabel: 'Цвет надписи', quote: true },
]

export const FONT_STYLES = [
  { id: 'all', name: 'Все' },
  { id: 'script', name: 'Рукописные' },
  { id: 'print', name: 'Печатные' },
  { id: 'deco', name: 'Декоративные', short: 'Декор' },
]

// weight — начертание, которое подключено в main.jsx.
export const FONTS = [
  { id: 'marck', name: 'Каллиграфия', style: 'script', family: "'Marck Script', cursive" },
  { id: 'pacifico', name: 'Ретро', style: 'script', family: "'Pacifico', cursive" },
  { id: 'caveat', name: 'От руки', style: 'script', family: "'Caveat', cursive", weight: 600 },
  { id: 'lobster', name: 'Леттеринг', style: 'script', family: "'Lobster', cursive" },
  { id: 'comfortaa', name: 'Округлый', style: 'print', family: "'Comfortaa', sans-serif", weight: 700 },
  { id: 'unbounded', name: 'Гротеск', style: 'print', family: "'Unbounded', sans-serif", upper: true },
  { id: 'montserrat-alt', name: 'Геометрия', style: 'print', family: "'Montserrat Alternates', sans-serif", weight: 600 },
  { id: 'yeseva', name: 'Антиква', style: 'deco', family: "'Yeseva One', serif" },
  { id: 'rubik-mono', name: 'Техно', style: 'deco', family: "'Rubik Mono One', sans-serif", upper: true },
  { id: 'press-start', name: 'Пиксели', style: 'deco', family: "'Press Start 2P', monospace", upper: true },
]

export const WALLS = [
  { id: 'brick', name: 'Кирпич' },
  { id: 'concrete', name: 'Бетон' },
  { id: 'dark', name: 'Тёмная' },
]

// order — как выравнивание звучит в заявке менеджеру.
export const ALIGNS = [
  { id: 'left', name: 'Слева', order: 'по левому краю' },
  { id: 'center', name: 'Центр', order: 'по центру' },
  { id: 'right', name: 'Справа', order: 'по правому краю' },
]

export const SHAPES = [
  { id: 'contour', name: 'По форме', hint: 'повторяет контур букв' },
  { id: 'rect', name: 'Прямоугольная', hint: 'ровная пластина' },
]

export const MATERIALS = [
  { id: 'clear', name: 'Прозрачный акрил' },
  { id: 'print', name: 'С рисунком', hint: 'УФ-печать', quote: true },
  { id: 'metal', name: 'Металл', quote: true },
  { id: 'black', name: 'Чёрный акрил' },
]

// Провод и держатели — как в блоке «Комплектация» на странице каталога.
export const PARTS = [
  { id: 'black', name: 'Чёрные', hex: '#151515' },
  { id: 'white', name: 'Белые', hex: '#f5f4ec' },
  { id: 'clear', name: 'Прозрачные', hex: 'rgba(245, 244, 236, 0.35)' },
]

export const MOUNTS = [
  { id: 'standoffs', name: 'Дистанционные держатели' },
  { id: 'hang', name: 'Подвес на тросике или леске' },
  { id: 'tape', name: 'Наноскотч' },
  { id: 'holes', name: 'Отверстия под ваше крепление', add: 200 },
]

export const PLACES = [
  { id: 'inside', name: 'В помещении', mult: 1 },
  { id: 'outside', name: 'На улице', hint: 'влагозащита', mult: 1.35 },
]

export const DIMMER = 1000
export const MONTAGE_FROM = 5000
export const MAX_TEXT = 40
export const SIZE = { min: 10, max: 300 }

// Фото вывесок из каталога для подсказки «как выглядит этот цвет».
export const COLOR_PHOTOS = Object.fromEntries(
  NEON_COLORS.map((c) => [c.id, SIGNS.find((p) => p.photoColor === c.id)?.card]).filter(([, src]) => src),
)

// Цена неоновой вывески. Сетка S–XL задана по ширине вывески (50–160 см); свободный размер
// приводим к ней через 1,6·√(длина·ширина) — это ширина типовой вывески той же площади.
const BASE = [
  [50, 4500],
  [80, 6900],
  [120, 9900],
  [160, 12900],
]
const PER_CHAR = [
  [50, 250],
  [80, 350],
  [120, 500],
  [160, 700],
]
const MIN_PRICE = 1900

// За краями сетки продолжаем крайний отрезок.
function interpolate(points, x) {
  let i = points.findIndex(([px]) => px >= x)
  if (i === -1) i = points.length - 1
  if (i === 0) i = 1
  const [x0, y0] = points[i - 1]
  const [x1, y1] = points[i]
  return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0)
}

export function neonPrice({ length, width, chars, shape, material, place, rgb, mount, dimmer, montage }) {
  const size = 1.6 * Math.sqrt(length * width)
  let p = interpolate(BASE, size) + Math.max(0, chars - 8) * Math.max(100, interpolate(PER_CHAR, size))
  p *= material === 'black' ? 1.15 : shape === 'rect' ? 1.08 : 1
  p *= place.mult * (rgb ? 1.3 : 1)
  p += mount.add ?? 0
  if (dimmer) p += DIMMER
  if (montage) p += MONTAGE_FROM
  return Math.max(MIN_PRICE, Math.round(p / 100) * 100)
}
