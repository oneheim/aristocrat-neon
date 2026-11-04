import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'

import SectionTitle from './SectionTitle.jsx'
import { Arrow } from './Hero.jsx'
import { NEON_COLORS, colorById } from '../data/colors.js'
import { formatPrice } from '../data/products.js'
import {
  ALIGNS,
  COLOR_PHOTOS,
  FONT_STYLES,
  FONTS,
  MATERIALS,
  MAX_TEXT,
  MONTAGE_FROM,
  MOUNTS,
  PARTS,
  PLACES,
  SHAPES,
  SIZE,
  TYPES,
  WALLS,
  DIMMER,
  neonPrice,
} from '../data/constructor.js'
import { sendOrder } from '../lib/order.js'
import { useSlidingThumb } from '../lib/useSlidingThumb.js'
import { drawPlate } from '../lib/contour.js'

const clampSize = (v) => Math.min(SIZE.max, Math.max(SIZE.min, Number.parseInt(v, 10) || SIZE.min))

// Строки → слова. Пробелы остаются текстом между словами, каждое слово получает ключ w0, w1…
function splitWords(lines) {
  let n = 0
  return lines.map((line) =>
    line
      .split(/(\s+)/)
      .filter((part) => part !== '')
      .map((part) => (/^\s+$/.test(part) ? { space: part } : { word: part, key: `w${n++}` })),
  )
}

export default function Constructor() {
  const [type, setType] = useState('neon')
  const [text, setText] = useState('Время кофе')
  const [align, setAlign] = useState('center')
  const [logo, setLogo] = useState(null)
  const [fontStyle, setFontStyle] = useState('all')
  const [fontId, setFontId] = useState('marck')
  const [colorId, setColorId] = useState('warm-white')
  const [dims, setDims] = useState({ length: '60', width: '45' })
  const [autoWidth, setAutoWidth] = useState(true)
  const [natural, setNatural] = useState({ w: 1, h: 1 })
  const [shapeId, setShapeId] = useState('contour')
  const [materialId, setMaterialId] = useState('clear')
  const [partsId, setPartsId] = useState('black')
  const [mountId, setMountId] = useState('standoffs')
  const [placeId, setPlaceId] = useState('inside')
  const [dimmer, setDimmer] = useState(false)
  const [montage, setMontage] = useState(false)
  const [wall, setWall] = useState('brick')
  const [wallPhoto, setWallPhoto] = useState(null)
  const [power, setPower] = useState(true)
  const [layout, setLayout] = useState({})
  const [selected, setSelected] = useState(null)
  const [toast, setToast] = useState('')

  const kind = TYPES.find((t) => t.id === type)
  const font = FONTS.find((f) => f.id === fontId)
  const color = colorById(colorId)
  const material = MATERIALS.find((m) => m.id === materialId)
  const shape = SHAPES.find((s) => s.id === shapeId)
  const parts = PARTS.find((p) => p.id === partsId)
  const mount = MOUNTS.find((m) => m.id === mountId)
  const place = PLACES.find((p) => p.id === placeId)
  const length = clampSize(dims.length)
  // «По тексту»: ширина следует пропорциям надписи, пока её не ввели вручную.
  const textWidth = clampSize(Math.round((length * natural.h) / natural.w))
  const width = autoWidth ? textWidth : clampSize(dims.width)
  const isNeon = type === 'neon'
  // Подложка есть у неона и контражура; лайтбокс — это короб.
  const hasBacking = type !== 'box'

  const lines = (text.trim() ? text : logo ? '' : 'Ваш текст').split('\n').slice(0, 3)
  const rows = splitWords(lines)
  const chars = text.replace(/\s/g, '').length
  const moved = Object.values(layout).some((p) => p.x || p.y || p.r)

  const quote = kind.quote || (isNeon && material.quote)
  const price = neonPrice({
    length,
    width,
    chars,
    shape: shapeId,
    material: materialId,
    place,
    rgb: color.rgb,
    mount,
    dimmer,
    montage,
  })

  // Загруженные картинки живут как object URL — освобождаем старые.
  useEffect(() => () => logo && URL.revokeObjectURL(logo.url), [logo])
  useEffect(() => () => wallPhoto && URL.revokeObjectURL(wallPhoto), [wallPhoto])

  const pickLogo = (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => setLogo({ url, name: file.name, ratio: img.naturalWidth / img.naturalHeight || 1 })
    img.src = url
  }

  const pickWall = (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setWallPhoto(URL.createObjectURL(file))
    setWall('photo')
  }

  const moveItem = useCallback((key, pos) => setLayout((l) => ({ ...l, [key]: pos })), [])

  const resetLayout = () => {
    setLayout({})
    setSelected(null)
  }

  const priceLine = quote
    ? 'Стоимость: рассчитать индивидуально'
    : `Предварительная стоимость: ${logo ? 'от' : '≈'} ${formatPrice(price)}`

  const details = [
    `Что делаем: ${kind.name}`,
    text.trim() && `Текст: «${text.trim().replace(/\n/g, ' / ')}», ${ALIGNS.find((a) => a.id === align).order}`,
    logo && 'Логотип: загружен в конструкторе — пришлю файл в чат',
    `Шрифт: ${font.name}`,
    `${kind.colorLabel}: ${color.name}`,
    `Размер: ${length} × ${width} см`,
    isNeon && `Подложка: ${shape.name.toLowerCase()}, ${material.name.toLowerCase()}`,
    type === 'halo' && `Подложка: прозрачный акрил, ${shape.name.toLowerCase()}`,
    isNeon && `Комплектующие: ${parts.name.toLowerCase()}`,
    isNeon && `Крепление: ${mount.name.toLowerCase()}`,
    `Размещение: ${place.name.toLowerCase()}`,
    (dimmer || montage) &&
      `Дополнительно: ${[dimmer && 'пульт с диммером', montage && 'монтаж'].filter(Boolean).join(', ')}`,
    moved && 'Слова расставлены вручную в превью — пришлю скриншот',
    priceLine,
  ].filter(Boolean)
  const orderText = ['Здравствуйте! Хочу заказать вывеску из конструктора на сайте aristocrat. neon.', '', ...details].join('\n')

  const order = async (channel) => {
    await sendOrder(channel, orderText)
    setToast('Текст заявки скопирован — если он не подставился, просто вставьте его в чат')
    setTimeout(() => setToast(''), 4200)
  }

  const fonts = fontStyle === 'all' ? FONTS : FONTS.filter((f) => f.style === fontStyle)

  return (
    <section className="section" id="constructor" aria-label="Конструктор вывески">
      <SectionTitle
        index="03"
        label="Конструктор"
        title="Соберите вывеску"
        script="и увидьте её до заказа"
        aside="Напишите текст или загрузите логотип, выберите шрифт, цвет и размер — превью и цена обновятся сразу. Слова на превью можно двигать и наклонять. Заявка уйдёт менеджеру в мессенджер, а дизайнер бесплатно доведёт макет."
      />

      <div className="cn" data-reveal>
        <div className="cn__glow" aria-hidden="true" />

        <div className="cn__preview">
          <div className="cn__bar">
            <Tabs label="Фон" items={WALLS} value={wall} onChange={setWall}>
              <label className={`cat-chip${wall === 'photo' ? ' is-active' : ''}`}>
                <input
                  type="file"
                  accept="image/*"
                  className="cn-file"
                  onChange={pickWall}
                  onClick={(e) => {
                    // Своё фото уже есть — первый клик просто возвращает его на фон.
                    if (wallPhoto && wall !== 'photo') {
                      e.preventDefault()
                      setWall('photo')
                    }
                  }}
                />
                <UploadIcon /> Своё фото
              </label>
            </Tabs>
            <button
              type="button"
              className={`power${power ? ' is-on' : ''}`}
              onClick={() => setPower((v) => !v)}
              aria-pressed={power}
            >
              <span className="power__knob" />
              {power ? 'Свет включён' : 'Свет выключен'}
            </button>
          </div>

          <Stage
            type={type}
            rows={rows}
            logo={logo}
            font={font}
            color={color}
            align={align}
            power={power}
            wall={wall}
            wallPhoto={wallPhoto}
            length={length}
            width={width}
            onMeasure={setNatural}
            shape={shapeId}
            material={isNeon ? materialId : 'clear'}
            layout={layout}
            selected={selected}
            onSelect={setSelected}
            onMove={moveItem}
          />

          <div className="cn__hint">
            <p>
              {selected
                ? 'Тяните слово, чтобы сдвинуть, или значок ↻, чтобы наклонить. Стрелки на клавиатуре тоже работают.'
                : 'Нажмите на слово, чтобы сдвинуть его или наклонить.'}
            </p>
            {moved && (
              <button type="button" className="btn btn--ghost btn--sm" onClick={resetLayout}>
                Собрать обратно
              </button>
            )}
          </div>

          <div className="cn-card cn-card--colors">
            <span className="cn-card__label">
              {kind.colorLabel} <em>{color.name}</em>
            </span>
            <ColorStrip value={colorId} onChange={setColorId} />
          </div>
        </div>

        <div className="cn__controls">
          <div className="cn-card cn-card--wide">
            <span className="cn-card__label">Что делаем</span>
            <Tabs label="Что делаем" items={TYPES} value={type} onChange={setType} className="cn-tabs--full" />
          </div>

          <div className="cn-card cn-card--compact">
            <div className="cn-card__head">
              <label className="cn-card__label" htmlFor="cn-text">
                Текст
              </label>
              <Tabs
                label="Выравнивание"
                items={ALIGNS.map((a) => ({ ...a, icon: <AlignIcon dir={a.id} /> }))}
                value={align}
                onChange={setAlign}
                className="cn-tabs--xs cn-tabs--icons cn-tabs--plain"
              />
            </div>
            <textarea
              id="cn-text"
              className="cn__input cn__input--compact"
              rows={Math.min(3, text.split('\n').length)}
              maxLength={MAX_TEXT}
              value={text}
              placeholder="Название, слоган или фраза"
              onChange={(e) => setText(e.target.value.split('\n').slice(0, 3).join('\n'))}
            />
          </div>

          <div className="cn-card cn-card--compact">
            <span className="cn-card__label">Логотип</span>
            {logo ? (
              <div className="cn-logo">
                <img src={logo.url} alt="Загруженный логотип" />
                <span>{logo.name}</span>
                <button type="button" aria-label="Убрать логотип" onClick={() => setLogo(null)}>
                  <svg width="14" height="14" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                    <path d="m4 4 10 10M14 4 4 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            ) : (
              <label className="cn-upload">
                <input type="file" accept="image/*" className="cn-file" onChange={pickLogo} />
                <UploadIcon />
                Загрузить
                <small>PNG или SVG</small>
              </label>
            )}
          </div>

          <div className="cn-card cn-card--wide">
            <div className="cn-card__head">
              <span className="cn-card__label">
                Шрифт
              </span>
              <Tabs label="Стиль шрифта" items={FONT_STYLES} value={fontStyle} onChange={setFontStyle} className="cn-tabs--xs" />
            </div>
            <Scroller key={fontStyle} label="шрифты">
              {fonts.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  className={`chip chip--font${fontId === f.id ? ' is-active' : ''}`}
                  aria-pressed={fontId === f.id}
                  onClick={() => setFontId(f.id)}
                >
                  <span style={{ fontFamily: f.family, fontWeight: f.weight }}>{f.upper ? 'НЕОН' : 'Неон'}</span>
                  <small>{f.name}</small>
                </button>
              ))}
            </Scroller>
          </div>

          <div className="cn-card">
            <span className="cn-card__label">Размер</span>
            <div className="cn-size">
              <label className="cn-field">
                <span>Длина</span>
                <input
                  type="number"
                  inputMode="numeric"
                  min={SIZE.min}
                  max={SIZE.max}
                  value={dims.length}
                  onChange={(e) => setDims((d) => ({ ...d, length: e.target.value }))}
                  onBlur={() => setDims((d) => ({ ...d, length: String(clampSize(d.length)) }))}
                />
                <em>см</em>
              </label>
              <label className="cn-field">
                <span>Ширина</span>
                <input
                  type="number"
                  inputMode="numeric"
                  min={SIZE.min}
                  max={SIZE.max}
                  value={autoWidth ? String(textWidth) : dims.width}
                  onChange={(e) => {
                    setAutoWidth(false)
                    setDims((d) => ({ ...d, width: e.target.value }))
                  }}
                  onBlur={(e) => {
                    // Пустое поле — ширина снова считается по пропорциям текста.
                    if (e.target.value.trim() === '') setAutoWidth(true)
                    else setDims((d) => ({ ...d, width: String(width) }))
                  }}
                />
                <em>см</em>
              </label>
            </div>
          </div>

          {hasBacking ? (
            <>
              <div className="cn-card">
                <span className="cn-card__label">Вид подложки</span>
                <div className="chips chips--stack">
                  {SHAPES.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      className={`chip${shapeId === s.id ? ' is-active' : ''}`}
                      aria-pressed={shapeId === s.id}
                      onClick={() => setShapeId(s.id)}
                    >
                      {s.name}
                      <small>{s.hint}</small>
                    </button>
                  ))}
                </div>
              </div>

            </>
          ) : null}

          <div className={`cn-card${hasBacking ? ' cn-card--wide' : ''}`}>
            <span className="cn-card__label">Материалы и монтаж</span>
            {!isNeon && (
              <p className="cn-card__text">
                {type === 'halo'
                  ? 'Буквы на прозрачной подложке, свет уходит на стену ореолом. Материалы подберём под фасад или интерьер.'
                  : 'Объёмные буквы: лицевая часть из молочного акрила с подсветкой изнутри, борта из ПВХ. Крепление подберём под место установки.'}
              </p>
            )}
            <div className="cn-selects">
              {isNeon && (
                <>
                  <Select
                    label="Материал подложки"
                    value={materialId}
                    onChange={setMaterialId}
                    options={MATERIALS}
                  />
                  <Select
                    label="Цвет комплектующих"
                    value={partsId}
                    onChange={setPartsId}
                    options={PARTS.map((p) => ({ ...p, dot: p.hex, note: 'в цене' }))}
                  />
                  <Select
                    label="Вид крепления"
                    value={mountId}
                    onChange={setMountId}
                    options={MOUNTS.map((m) => ({
                      ...m,
                      note: m.add ? `+${formatPrice(m.add)}` : 'в цене',
                      badge: m.add && `+${formatPrice(m.add)}`,
                    }))}
                  />
                </>
              )}
              <Select
                label="Где будет висеть"
                value={placeId}
                onChange={setPlaceId}
                options={PLACES.map((p) => ({ ...p, note: p.hint, badge: p.hint }))}
              />
            </div>
          </div>

          <div className="cn-card cn-card--wide">
            <span className="cn-card__label">Дополнительно</span>
            <div className="cn-extras">
              <label className="check">
                <input type="checkbox" checked={dimmer} onChange={(e) => setDimmer(e.target.checked)} />
                <span className="check__box" />
                Пульт с диммером <em>+{formatPrice(DIMMER)}</em>
              </label>
              <label className="check">
                <input type="checkbox" checked={montage} onChange={(e) => setMontage(e.target.checked)} />
                <span className="check__box" />
                Монтаж <em>от {formatPrice(MONTAGE_FROM)}</em>
              </label>
            </div>
          </div>

          <div className="cn-card cn-card--wide cn-card--total">
            <div className="cn__total">
              <div>
                <span className="cn-card__label">Итого</span>
                {quote ? (
                  <span className="cn__total-price cn__total-price--quote">Рассчитаем индивидуально</span>
                ) : (
                  <span className="cn__total-price" key={price}>
                    {logo ? 'от' : '≈'} {formatPrice(price)}
                  </span>
                )}
              </div>
              <p className="cn__total-note">
                {quote
                  ? 'Менеджер посчитает стоимость по макету — бесплатно'
                  : logo
                    ? 'Логотип добавит к цене — посчитаем по макету'
                    : 'Точную цену менеджер подтвердит после бесплатного макета'}
              </p>
            </div>
            <div className="cn__send">
              <button type="button" className="btn btn--red btn--block" onClick={() => order('telegram')}>
                <TgIcon /> Отправить в Telegram
              </button>
              <button type="button" className="btn btn--ghost btn--block" onClick={() => order('whatsapp')}>
                <WaIcon /> WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={`toast${toast ? ' is-shown' : ''}`} role="status">
        {toast}
      </div>
    </section>
  )
}

// Стеклянные вкладки с бегунком, как фильтры в каталоге. children — дополнительные кнопки в конце.
// У пункта может быть icon (тогда название уходит в подсказку) или short — подпись для узкого экрана.
function Tabs({ label, items, value, onChange, className = '', children }) {
  const bar = useRef(null)
  const thumb = useRef(null)
  useSlidingThumb(bar, thumb, value)
  return (
    <div className={`cat-bar cat-bar--mode cn-tabs ${className}`} role="group" aria-label={label} ref={bar}>
      <span className="cat-bar__thumb" ref={thumb} aria-hidden="true" />
      {items.map((it) => (
        <button
          key={it.id}
          type="button"
          className={`cat-chip${value === it.id ? ' is-active' : ''}`}
          aria-pressed={value === it.id}
          aria-label={it.icon ? it.name : undefined}
          title={it.icon ? it.name : undefined}
          onClick={() => onChange(it.id)}
        >
          {it.icon ||
            (it.short ? (
              <>
                <span className="cn-tabs__full">{it.name}</span>
                <span className="cn-tabs__short">{it.short}</span>
              </>
            ) : (
              it.name
            ))}
        </button>
      ))}
      {children}
    </div>
  )
}

// Лента в одну строку: стрелки, свайп, колесо мыши. Края гаснут только там, куда ещё можно листать.
function Scroller({ label, children }) {
  const strip = useRef(null)
  const [edge, setEdge] = useState({ start: true, end: true })

  useLayoutEffect(() => {
    const el = strip.current
    const check = () =>
      setEdge({ start: el.scrollLeft < 4, end: el.scrollLeft + el.clientWidth > el.scrollWidth - 4 })
    const onWheel = (e) => {
      if (el.scrollWidth <= el.clientWidth || Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return
      e.preventDefault()
      el.scrollLeft += e.deltaY
    }
    check()
    el.addEventListener('scroll', check, { passive: true })
    el.addEventListener('wheel', onWheel, { passive: false })
    const ro = new ResizeObserver(check)
    ro.observe(el)
    return () => {
      el.removeEventListener('scroll', check)
      el.removeEventListener('wheel', onWheel)
      ro.disconnect()
    }
  }, [])

  const scroll = (dir) => strip.current.scrollBy({ left: dir * strip.current.clientWidth * 0.7, behavior: 'smooth' })

  return (
    <div className="cn-scroller">
      <button type="button" className="cn-arrow" aria-label={`Листать ${label} назад`} disabled={edge.start} onClick={() => scroll(-1)}>
        <Arrow dir="left" />
      </button>
      <div className={`cn-scroller__strip${edge.start ? ' is-start' : ''}${edge.end ? ' is-end' : ''}`} ref={strip}>
        {children}
      </div>
      <button type="button" className="cn-arrow" aria-label={`Листать ${label} вперёд`} disabled={edge.end} onClick={() => scroll(1)}>
        <Arrow />
      </button>
    </div>
  )
}

// Выпадающий список: стрелки ↑↓ выбирают, Enter подтверждает, Esc и клик мимо закрывают.
// У пункта может быть dot — кружок цвета, note — подпись в списке и badge — подпись на кнопке,
// когда пункт выбран (только то, что меняет цену или условия, чтобы название помещалось).
function Select({ label, options, value, onChange }) {
  const [open, setOpen] = useState(false)
  const [hi, setHi] = useState(0)
  const root = useRef(null)
  const button = useRef(null)
  const id = useId()
  const current = options.find((o) => o.id === value)

  useEffect(() => {
    if (!open) return
    const close = (e) => {
      if (!root.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('pointerdown', close)
    return () => document.removeEventListener('pointerdown', close)
  }, [open])

  const show = () => {
    setHi(Math.max(0, options.findIndex((o) => o.id === value)))
    setOpen(true)
  }
  const choose = (o) => {
    onChange(o.id)
    setOpen(false)
    button.current.focus()
  }

  const onKey = (e) => {
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        e.preventDefault()
        show()
      }
      return
    }
    if (e.key === 'Escape') {
      e.preventDefault()
      setOpen(false)
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHi((i) => (i + 1) % options.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHi((i) => (i - 1 + options.length) % options.length)
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      choose(options[hi])
    } else if (e.key === 'Tab') {
      setOpen(false)
    }
  }

  const face = (o) => (
    <>
      {o.dot && <span className="chip__dot" style={{ '--dot': o.dot }} aria-hidden="true" />}
      <span className="cn-select__name">{o.name}</span>
    </>
  )

  return (
    <div className={`cn-select${open ? ' is-open' : ''}`} ref={root}>
      <span className="cn-select__label" id={`${id}-label`}>
        {label}
      </span>
      <button
        type="button"
        ref={button}
        className="cn-select__btn"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-labelledby={`${id}-label ${id}-value`}
        aria-activedescendant={open ? `${id}-${hi}` : undefined}
        onClick={() => (open ? setOpen(false) : show())}
        onKeyDown={onKey}
      >
        <span className="cn-select__value" id={`${id}-value`}>
          {face(current)}
        </span>
        {current.badge && <small className="cn-select__note">{current.badge}</small>}
        <svg className="cn-select__chev" width="14" height="14" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <path d="m4.5 7 4.5 4.5L13.5 7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <ul className="cn-select__list" role="listbox" id={`${id}-list`} aria-labelledby={`${id}-label`}>
          {options.map((o, i) => (
            <li
              key={o.id}
              id={`${id}-${i}`}
              role="option"
              aria-selected={o.id === value}
              className={`cn-select__opt${i === hi ? ' is-hi' : ''}${o.id === value ? ' is-active' : ''}`}
              onPointerEnter={() => setHi(i)}
              onClick={() => choose(o)}
            >
              {face(o)}
              {o.note && <small>{o.note}</small>}
              <svg className="cn-select__check" width="14" height="14" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="m4 9.5 3.2 3L14 5.5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function AlignIcon({ dir }) {
  const lines = { left: ['M3 5h12', 'M3 9h8', 'M3 13h10'], center: ['M3 5h12', 'M5 9h8', 'M4 13h10'], right: ['M3 5h12', 'M7 9h8', 'M5 13h10'] }
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      {lines[dir].map((d) => (
        <path key={d} d={d} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      ))}
    </svg>
  )
}

// Превью: стена, рабочее поле размером длина × ширина и надпись, подогнанная под поле.
function Stage({
  type,
  rows,
  logo,
  font,
  color,
  align,
  power,
  wall,
  wallPhoto,
  length,
  width,
  onMeasure,
  shape,
  material,
  layout,
  selected,
  onSelect,
  onMove,
}) {
  const stageRef = useRef(null)
  const measureRef = useRef(null)
  const signRef = useRef(null)
  const [stage, setStage] = useState({ w: 800, h: 550 })
  const [natural, setNatural] = useState({ w: 1, h: 1 })
  const report = useRef(onMeasure)
  report.current = onMeasure

  useLayoutEffect(() => {
    const el = stageRef.current
    const ro = new ResizeObserver(() => setStage({ w: el.clientWidth, h: el.clientHeight }))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Размер надписи при шрифте 100px — по нему подгоняем текст под поле. Шрифты догружаются позже, тогда меряем снова.
  const textKey = rows.map((r) => r.map((p) => p.word ?? p.space).join('')).join('\n')
  useLayoutEffect(() => {
    const el = measureRef.current
    const measure = () => {
      const size = { w: el.offsetWidth || 1, h: el.offsetHeight || 1 }
      setNatural(size)
      report.current?.(size)
    }
    measure()
    document.fonts?.addEventListener('loadingdone', measure)
    return () => document.fonts?.removeEventListener('loadingdone', measure)
  }, [textKey, font, logo, align])

  const ratio = length / width
  const maxW = stage.w * 0.72
  const maxH = stage.h * 0.56
  const board = maxW / ratio <= maxH ? { w: maxW, h: maxW / ratio } : { w: maxH * ratio, h: maxH }
  const contour = type !== 'box' && shape === 'contour'
  // Подложка «по форме» шире букв — оставляем ей место, чтобы она укладывалась в длину и ширину.
  const fill = type === 'box' ? 0.84 : contour ? 0.8 : 0.9
  const fontPx = Math.max(6, Math.min((board.w * fill) / natural.w, (board.h * fill) / natural.h) * 100)

  const signStyle = {
    '--c': color.hex,
    fontFamily: font.family,
    fontWeight: font.weight,
    textTransform: font.upper ? 'uppercase' : 'none',
  }

  const content = (item) => (
    <span className={`neon-sign__block align--${align}`}>
      {logo && (
        <span className="neon-sign__line">
          {item('logo', '', <img className="neon-logo" src={logo.url} alt="" style={{ width: `${1.6 * logo.ratio}em` }} />)}
        </span>
      )}
      {rows.map((row, i) => (
        <span key={i} className="neon-sign__line">
          {row.map((part) => (part.word ? item(part.key, part.word, part.word) : part.space))}
        </span>
      ))}
    </span>
  )

  return (
    <div
      ref={stageRef}
      className={`cn__stage wall--${wall}${power ? ' is-on' : ''}`}
      style={wall === 'photo' && wallPhoto ? { backgroundImage: `url(${wallPhoto})` } : undefined}
      onPointerDown={(e) => {
        if (!e.target.closest('.neon-word')) onSelect(null)
      }}
    >
      <div className="cn__room-light" style={{ '--c': color.hex }} />

      <div
        className={`cn__board type--${type} shape--${shape} material--${material}`}
        style={{ width: board.w, height: board.h, '--c': color.hex }}
      >
        {contour && (
          <ContourPlate signRef={signRef} fontPx={fontPx} font={font} look={plateLook(material, power, color.hex)} layout={layout} />
        )}

        <div
          ref={signRef}
          className={`neon-sign${power ? ' is-on' : ''}${color.rgb ? ' is-rgb' : ''}`}
          style={{ ...signStyle, fontSize: fontPx }}
        >
          {content((key, label, children) => (
            <Word
              key={key}
              id={key}
              label={label}
              pos={layout[key]}
              fontPx={fontPx}
              selected={selected === key}
              onSelect={onSelect}
              onMove={onMove}
            >
              {children}
            </Word>
          ))}
        </div>

        <span className="cn__dim cn__dim--x">
          <i />
          длина {length} см
          <i />
        </span>
        <span className="cn__dim cn__dim--y">
          <i />
          <b>ширина {width} см</b>
          <i />
        </span>
      </div>

      <div className="neon-sign neon-measure" ref={measureRef} style={{ ...signStyle, fontSize: 100 }} aria-hidden="true">
        {content((key, label, children) => (
          <span key={key} className="neon-word">
            {children}
          </span>
        ))}
      </div>
    </div>
  )
}

const placeOf = (pos = { x: 0, y: 0, r: 0 }) => `translate(${pos.x}em, ${pos.y}em) rotate(${pos.r}deg)`

const CREAM = '#f5f4ec'
function mix(a, b, t) {
  const rgb = (hex) => [1, 3, 5].map((i) => Number.parseInt(hex.slice(i, i + 2), 16))
  const [x, y] = [rgb(a), rgb(b)]
  return `#${x.map((v, i) => Math.round(v * (1 - t) + y[i] * t).toString(16).padStart(2, '0')).join('')}`
}

// Цвет подложки и её кромки. Прозрачный акрил подхватывает свет неона — кромка светится его оттенком.
function plateLook(material, power, neon) {
  if (material === 'black') return { fill: '#070707', fillA: 0.96, edge: power ? mix(neon, CREAM, 0.5) : CREAM, edgeA: power ? 0.4 : 0.16 }
  if (material === 'metal') return { fill: '#a3a29c', fillA: 1, edge: '#ecebe4', edgeA: 0.85 }
  if (material === 'print') return { fill: '#6b2d55', fillA: 0.88, edge: CREAM, edgeA: 0.3 }
  return power
    ? { fill: mix(neon, CREAM, 0.55), fillA: 0.16, edge: mix(neon, CREAM, 0.35), edgeA: 0.75 }
    : { fill: CREAM, fillA: 0.1, edge: CREAM, edgeA: 0.35 }
}

// Общая подложка «по форме». Рисуется на холсте по настоящим положениям слов (см. lib/contour.js);
// пересчитывается, только когда слова, шрифт, размер или цвет действительно изменились.
function ContourPlate({ signRef, fontPx, font, look, layout }) {
  const canvas = useRef(null)
  const last = useRef('')
  const frame = useRef(0)

  // Обычный эффект, а не layout: надпись стоит в разметке после холста, и её ref к layout-фазе холста ещё не привязан.
  useEffect(() => {
    const sign = signRef.current
    if (!sign) return
    const lines = [...sign.querySelectorAll('.neon-sign__line')]
    const items = [...sign.querySelectorAll('.neon-word')].map((el) => ({
      line: lines.indexOf(el.parentElement),
      x: el.offsetLeft,
      y: el.offsetTop,
      w: el.offsetWidth,
      h: el.offsetHeight,
      text: el.dataset.text,
      img: el.querySelector('img'),
      pos: layout[el.dataset.key] || { x: 0, y: 0, r: 0 },
    }))
    const width = sign.offsetWidth
    const height = sign.offsetHeight
    const key = JSON.stringify([items.map((i) => [i.line, i.x, i.y, i.w, i.h, i.text, i.pos, i.img?.src]), width, height, fontPx, font.id, look])
    if (key === last.current) return
    last.current = key
    cancelAnimationFrame(frame.current)
    frame.current = requestAnimationFrame(() => drawPlate(canvas.current, { items, width, height, fontPx, font, look }))
  })

  useEffect(() => () => cancelAnimationFrame(frame.current), [])

  return (
    <canvas
      ref={canvas}
      className="cn-plate"
      style={{ filter: `drop-shadow(0 ${fontPx * 0.04}px ${fontPx * 0.05}px rgba(0, 0, 0, 0.45))` }}
      aria-hidden="true"
    />
  )
}

// Слово или логотип на превью: перетаскивается, наклоняется за значок ↻, двигается стрелками.
function Word({ id, label, pos = { x: 0, y: 0, r: 0 }, fontPx, selected, onSelect, onMove, children }) {
  const drag = useRef(null)
  const spin = useRef(null)

  const startDrag = (e) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return
    e.preventDefault()
    onSelect(id)
    e.currentTarget.setPointerCapture(e.pointerId)
    drag.current = { px: e.clientX, py: e.clientY, x: pos.x, y: pos.y }
  }
  const doDrag = (e) => {
    const d = drag.current
    if (!d) return
    onMove(id, { ...pos, x: d.x + (e.clientX - d.px) / fontPx, y: d.y + (e.clientY - d.py) / fontPx })
  }

  const startSpin = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const r = e.currentTarget.parentElement.getBoundingClientRect()
    const cx = r.left + r.width / 2
    const cy = r.top + r.height / 2
    e.currentTarget.setPointerCapture(e.pointerId)
    spin.current = { cx, cy, a: Math.atan2(e.clientY - cy, e.clientX - cx), r: pos.r }
  }
  const doSpin = (e) => {
    const s = spin.current
    if (!s) return
    let r = s.r + ((Math.atan2(e.clientY - s.cy, e.clientX - s.cx) - s.a) * 180) / Math.PI
    r = ((r + 540) % 360) - 180
    if (Math.abs(r) < 3) r = 0
    onMove(id, { ...pos, r })
  }

  const onKey = (e) => {
    const step = e.shiftKey ? 0.2 : 0.05
    const keys = {
      ArrowLeft: { x: pos.x - step },
      ArrowRight: { x: pos.x + step },
      ArrowUp: { y: pos.y - step },
      ArrowDown: { y: pos.y + step },
      '[': { r: pos.r - 5 },
      ']': { r: pos.r + 5 },
    }
    if (!keys[e.key]) return
    e.preventDefault()
    onMove(id, { ...pos, ...keys[e.key] })
  }

  return (
    <span
      className={`neon-word${selected ? ' is-selected' : ''}`}
      data-key={id}
      data-text={label}
      style={{ transform: placeOf(pos) }}
      tabIndex={0}
      aria-label={label ? `Слово «${label}»: стрелки сдвигают, квадратные скобки наклоняют` : 'Логотип'}
      onPointerDown={startDrag}
      onPointerMove={doDrag}
      onPointerUp={() => (drag.current = null)}
      onPointerCancel={() => (drag.current = null)}
      onFocus={() => onSelect(id)}
      onKeyDown={onKey}
    >
      {children}
      {selected && (
        <span
          className="neon-word__spin"
          aria-hidden="true"
          onPointerDown={startSpin}
          onPointerMove={doSpin}
          onPointerUp={() => (spin.current = null)}
          onPointerCancel={() => (spin.current = null)}
        >
          <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
            <path
              d="M14.5 9a5.5 5.5 0 1 1-1.6-3.9M13 2.5v3h-3"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      )}
    </span>
  )
}

// Цвета свечения: лента прокручивается по кругу, при наведении — фото вывески этого цвета из каталога.
function ColorStrip({ value, onChange }) {
  const wrap = useRef(null)
  const strip = useRef(null)
  const tipTimer = useRef(0)
  const [tip, setTip] = useState(null)

  useLayoutEffect(() => {
    const el = strip.current
    el.scrollLeft = el.scrollWidth / 3
    // Вертикальное колесо мыши листает ленту вбок.
    const onWheel = (e) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return
      e.preventDefault()
      el.scrollLeft += e.deltaY
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [])

  const loop = () => {
    const el = strip.current
    const one = el.scrollWidth / 3
    if (el.scrollLeft < one * 0.5) el.scrollLeft += one
    else if (el.scrollLeft > one * 1.5) el.scrollLeft -= one
    setTip(null)
  }

  const showTip = (c, target) => {
    const r = target.getBoundingClientRect()
    const w = wrap.current.getBoundingClientRect()
    const left = Math.min(w.width - 74, Math.max(74, r.left + r.width / 2 - w.left))
    setTip({ c, left })
  }

  return (
    <div className="cn-colors" ref={wrap}>
      <button
        type="button"
        className="cn-arrow"
        aria-label="Предыдущие цвета"
        onClick={() => strip.current.scrollBy({ left: -170, behavior: 'smooth' })}
      >
        <Arrow dir="left" />
      </button>
      <div className="cn-colors__strip" ref={strip} onScroll={loop}>
        {[0, 1, 2].flatMap((copy) =>
          NEON_COLORS.map((c) => (
            <button
              key={`${copy}-${c.id}`}
              type="button"
              className={`swatch${value === c.id ? ' is-active' : ''}${c.rgb ? ' swatch--rgb' : ''}`}
              style={{ '--c': c.hex }}
              aria-label={c.name}
              aria-pressed={value === c.id}
              tabIndex={copy === 1 ? 0 : -1}
              aria-hidden={copy === 1 ? undefined : true}
              onClick={() => onChange(c.id)}
              onMouseEnter={(e) => showTip(c, e.currentTarget)}
              onMouseLeave={() => setTip(null)}
              onFocus={(e) => showTip(c, e.currentTarget)}
              onBlur={() => setTip(null)}
              onPointerDown={(e) => {
                if (e.pointerType === 'mouse') return
                showTip(c, e.currentTarget)
                clearTimeout(tipTimer.current)
                tipTimer.current = setTimeout(() => setTip(null), 2200)
              }}
            />
          )),
        )}
      </div>
      <button
        type="button"
        className="cn-arrow"
        aria-label="Следующие цвета"
        onClick={() => strip.current.scrollBy({ left: 170, behavior: 'smooth' })}
      >
        <Arrow />
      </button>

      {tip && (
        <div className="cn-tip" style={{ left: tip.left }} role="tooltip">
          {COLOR_PHOTOS[tip.c.id] ? (
            <img src={COLOR_PHOTOS[tip.c.id]} alt="" />
          ) : (
            <span className={`cn-tip__sample${tip.c.rgb ? ' is-rgb' : ''}`} style={{ '--c': tip.c.hex }}>
              Неон
            </span>
          )}
          {tip.c.name}
          <small>{COLOR_PHOTOS[tip.c.id] ? 'фото вывески из каталога' : 'образец свечения'}</small>
        </div>
      )}
    </div>
  )
}

function UploadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M9 12V3M5.5 6.5 9 3l3.5 3.5M3 12.5V15h12v-2.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function TgIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M21.4 3.6 2.9 10.7c-1.3.5-1.2 1.2-.2 1.5l4.7 1.5 1.8 5.6c.2.7.4.9.9.9.4 0 .6-.2.9-.5l2.3-2.2 4.8 3.5c.9.5 1.5.2 1.7-.8l3.1-14.7c.3-1.3-.5-1.9-1.5-1.4ZM9.6 13.4l8.3-5.2c.4-.2.7-.1.4.2l-7 6.4-.3 3.2-1.4-4.6Z" />
    </svg>
  )
}

export function WaIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.5 1 2.7c.1.2 1.8 2.8 4.4 3.9 1.6.7 2.3.8 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z" />
    </svg>
  )
}
