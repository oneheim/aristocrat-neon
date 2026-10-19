import { useMemo, useState } from 'react'

import SectionTitle from './SectionTitle.jsx'
import { NEON_COLORS, colorById } from '../data/colors.js'
import { formatPrice } from '../data/products.js'
import { sendOrder } from '../lib/order.js'

const FONTS = [
  { id: 'marck', name: 'Каллиграфия', family: "'Marck Script', cursive", w: 0.5 },
  { id: 'pacifico', name: 'Ретро', family: "'Pacifico', cursive", w: 0.62 },
  { id: 'caveat', name: 'От руки', family: "'Caveat', cursive", w: 0.46 },
  { id: 'comfortaa', name: 'Округлый', family: "'Comfortaa', sans-serif", w: 0.66 },
  { id: 'unbounded', name: 'Гротеск', family: "'Unbounded', sans-serif", w: 0.82, upper: true },
]

const SIZES = [
  { id: 'S', name: 'S', width: 50, base: 4500, perChar: 250, k: 9 },
  { id: 'M', name: 'M', width: 80, base: 6900, perChar: 350, k: 12 },
  { id: 'L', name: 'L', width: 120, base: 9900, perChar: 500, k: 15 },
  { id: 'XL', name: 'XL', width: 160, base: 12900, perChar: 700, k: 18 },
]

const BACKINGS = [
  { id: 'contour', name: 'Акрил по контуру', hint: 'прозрачный, почти не виден', mult: 1 },
  { id: 'rect', name: 'Прямоугольный акрил', hint: 'прозрачная пластина', mult: 1.08 },
  { id: 'black', name: 'Чёрный акрил', hint: 'контрастная подложка', mult: 1.15 },
]

const PLACES = [
  { id: 'inside', name: 'В помещении', mult: 1 },
  { id: 'outside', name: 'На улице', hint: 'влагозащита', mult: 1.35 },
]

const WALLS = [
  { id: 'brick', name: 'Кирпич' },
  { id: 'concrete', name: 'Бетон' },
  { id: 'dark', name: 'Тёмная' },
]

const MAX_LEN = 40
const MOUNT_FROM = 5000

export default function Constructor() {
  const [text, setText] = useState('Время\nкофе')
  const [fontId, setFontId] = useState('marck')
  const [colorId, setColorId] = useState('warm-white')
  const [sizeId, setSizeId] = useState('M')
  const [backingId, setBackingId] = useState('contour')
  const [placeId, setPlaceId] = useState('inside')
  const [dimmer, setDimmer] = useState(false)
  const [mount, setMount] = useState(false)
  const [wall, setWall] = useState('brick')
  const [power, setPower] = useState(true)
  const [toast, setToast] = useState('')

  const font = FONTS.find((f) => f.id === fontId)
  const color = colorById(colorId)
  const size = SIZES.find((s) => s.id === sizeId)
  const backing = BACKINGS.find((b) => b.id === backingId)
  const place = PLACES.find((p) => p.id === placeId)

  const shown = text.trim() ? text : 'Ваш текст'
  const lines = shown.split('\n').slice(0, 3)
  const longest = Math.max(...lines.map((l) => l.length), 3)
  const chars = text.replace(/\s/g, '').length

  // Размер шрифта в превью: растёт вместе с выбранным размером, но не вылезает за рамку.
  const fontK = Math.min(size.k, 84 / (longest * font.w), 60 / (lines.length * 1.2))

  const price = useMemo(() => {
    let p = size.base + Math.max(0, chars - 8) * size.perChar
    p *= backing.mult * place.mult * (color.rgb ? 1.3 : 1)
    if (dimmer) p += 1000
    if (mount) p += MOUNT_FROM
    return Math.round(p / 100) * 100
  }, [size, chars, backing, place, color, dimmer, mount])

  const orderText = [
    'Здравствуйте! Хочу заказать неоновую вывеску из конструктора на сайте aristocrat. neon.',
    '',
    `Текст: «${text.trim().replace(/\n/g, ' / ') || '—'}»`,
    `Шрифт: ${font.name}`,
    `Цвет: ${color.name}`,
    `Размер: ${size.name}, ширина ≈ ${size.width} см`,
    `Подложка: ${backing.name}`,
    `Размещение: ${place.name}`,
    dimmer || mount ? `Дополнительно: ${[dimmer && 'пульт-диммер', mount && 'монтаж'].filter(Boolean).join(', ')}` : '',
    `Предварительная стоимость: ≈ ${formatPrice(price)}`,
  ]
    .filter((l) => l !== '')
    .join('\n')

  const order = async (channel) => {
    await sendOrder(channel, orderText)
    setToast('Текст заявки скопирован — если он не подставился, просто вставьте его в чат')
    setTimeout(() => setToast(''), 4200)
  }

  return (
    <section className="section" id="constructor" aria-label="Конструктор неоновой вывески">
      <SectionTitle
        index="03"
        label="Конструктор"
        title="Соберите вывеску"
        script="и увидьте её до заказа"
        aside="Напишите текст, выберите шрифт, цвет и размер — превью и цена обновятся сразу. Заявка уйдёт менеджеру в мессенджер, а дизайнер бесплатно доведёт макет."
      />

      <div className="cn" data-reveal>
        <div className="cn__glow" aria-hidden="true" />

        <div className="cn__preview">
          <div className="cn__bar">
            <div className="segmented" role="group" aria-label="Стена">
              {WALLS.map((w) => (
                <button
                  key={w.id}
                  type="button"
                  className={wall === w.id ? 'is-active' : ''}
                  onClick={() => setWall(w.id)}
                >
                  {w.name}
                </button>
              ))}
            </div>
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

          <div className={`cn__stage wall--${wall}${power ? ' is-on' : ''}`}>
            <div className="cn__room-light" style={{ '--c': color.hex }} />
            <div
              key={`${fontId}-${colorId}-${power}`}
              className={`neon-sign backing--${backingId}${color.rgb ? ' is-rgb' : ''}${power ? ' is-on' : ''}`}
              style={{
                '--c': color.hex,
                '--k': fontK,
                fontFamily: font.family,
                textTransform: font.upper ? 'uppercase' : 'none',
                fontWeight: font.id === 'unbounded' ? 400 : undefined,
              }}
              aria-label={`Превью: ${shown}`}
            >
              {lines.map((l, i) => (
                <span key={i} className="neon-sign__line" data-text={l || ' '}>
                  {l || ' '}
                </span>
              ))}
            </div>
            <div className="cn__ruler">
              <span />
              ширина ≈ {size.width} см
              <span />
            </div>
          </div>
        </div>

        <div className="cn__controls">
          <div className="cn__group">
            <label className="cn__label" htmlFor="cn-text">
              <span>1</span> Текст
              <em>
                {text.length}/{MAX_LEN}
              </em>
            </label>
            <textarea
              id="cn-text"
              className="cn__input"
              rows={2}
              maxLength={MAX_LEN}
              value={text}
              placeholder="Название, слоган или фраза"
              onChange={(e) => setText(e.target.value.split('\n').slice(0, 3).join('\n'))}
            />
          </div>

          <div className="cn__group">
            <span className="cn__label">
              <span>2</span> Шрифт
            </span>
            <div className="chips chips--fonts">
              {FONTS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  className={`chip chip--font${fontId === f.id ? ' is-active' : ''}`}
                  style={{ fontFamily: f.family }}
                  onClick={() => setFontId(f.id)}
                  title={f.name}
                >
                  {f.upper ? 'НЕОН' : 'Неон'}
                </button>
              ))}
            </div>
          </div>

          <div className="cn__group">
            <span className="cn__label">
              <span>3</span> Цвет свечения
              <em>{color.name}</em>
            </span>
            <div className="swatches">
              {NEON_COLORS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={`swatch${colorId === c.id ? ' is-active' : ''}${c.rgb ? ' swatch--rgb' : ''}`}
                  style={{ '--c': c.hex }}
                  onClick={() => setColorId(c.id)}
                  aria-label={c.name}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          <div className="cn__group">
            <span className="cn__label">
              <span>4</span> Размер
              <em>ширина ≈ {size.width} см</em>
            </span>
            <div className="chips chips--even">
              {SIZES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={`chip${sizeId === s.id ? ' is-active' : ''}`}
                  onClick={() => setSizeId(s.id)}
                >
                  {s.name}
                  <small>{s.width} см</small>
                </button>
              ))}
            </div>
          </div>

          <div className="cn__group">
            <span className="cn__label">
              <span>5</span> Подложка и размещение
            </span>
            <div className="chips chips--even chips--3">
              {BACKINGS.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  className={`chip chip--tall${backingId === b.id ? ' is-active' : ''}`}
                  onClick={() => setBackingId(b.id)}
                >
                  {b.name}
                  <small>{b.hint}</small>
                </button>
              ))}
            </div>
            <div className="chips chips--even">
              {PLACES.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className={`chip${placeId === p.id ? ' is-active' : ''}`}
                  onClick={() => setPlaceId(p.id)}
                >
                  {p.name}
                  {p.hint && <small>{p.hint}</small>}
                </button>
              ))}
            </div>
          </div>

          <div className="cn__group">
            <span className="cn__label">
              <span>6</span> Дополнительно
            </span>
            <label className="check">
              <input type="checkbox" checked={dimmer} onChange={(e) => setDimmer(e.target.checked)} />
              <span className="check__box" />
              Пульт с диммером яркости <em>+1 000 ₽</em>
            </label>
            <label className="check">
              <input type="checkbox" checked={mount} onChange={(e) => setMount(e.target.checked)} />
              <span className="check__box" />
              Монтаж нашей командой <em>от 5 000 ₽</em>
            </label>
          </div>

          <div className="cn__total">
            <div>
              <span className="cn__total-label">Предварительно</span>
              <span className="cn__total-price">≈ {formatPrice(price)}</span>
            </div>
            <p className="cn__total-note">Точную цену менеджер подтвердит после бесплатного макета</p>
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

      <div className={`toast${toast ? ' is-shown' : ''}`} role="status">
        {toast}
      </div>
    </section>
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
