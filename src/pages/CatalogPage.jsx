import { useEffect, useMemo, useRef } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'

import SectionTitle from '../components/SectionTitle.jsx'
import ProductCard from '../components/ProductCard.jsx'
import CtaBlock from '../components/CtaBlock.jsx'
import { Arrow } from '../components/Hero.jsx'
import { CATEGORIES, MARQUEES, RENTABLE, SIGNS, formatPrice, marqueesWord, signsWord } from '../data/products.js'
import { sendOrder } from '../lib/order.js'
import { useSlidingThumb } from '../lib/useSlidingThumb.js'

const RIBS = Array.from({ length: 22 })

const SORTS = [
  { id: 'popular', name: 'Популярные' },
  { id: 'cheap', name: 'Дешевле' },
  { id: 'expensive', name: 'Дороже' },
]

// Опции заказа — как в карточках товаров на aristocrat-neon.ru.
const KIT = [
  {
    title: 'Питание',
    tone: 'red',
    items: [
      ['Без блока питания', 'базовая цена'],
      ['С блоком питания', '+700 ₽'],
      ['С пультом-диммером', '+700 ₽'],
    ],
  },
  {
    title: 'Провод',
    items: [
      ['Длина 2 или 3 м', 'в цене'],
      ['Длина 4 м', '+50 ₽'],
      ['Длина 5 м', '+75 ₽'],
      ['Белый, чёрный или прозрачный', 'в цене'],
    ],
  },
  {
    title: 'Подложка',
    items: [
      ['Прозрачная по контуру', 'в цене'],
      ['Прозрачная прямоугольная', 'в цене'],
      ['Цветная по контуру', 'в цене'],
      ['Цветная прямоугольная', 'в цене'],
    ],
  },
  {
    title: 'Крепление',
    items: [
      ['Наноскотч', 'в цене'],
      ['Дистанционные держатели', 'в цене'],
      ['Подвес на тросике или леске', 'в цене'],
      ['Отверстия под ваше крепление', '+200 ₽'],
    ],
  },
  {
    title: 'Доставка и монтаж',
    items: [
      ['Самовывоз с производства', 'бесплатно'],
      ['Доставка по Москве', '700 ₽'],
      ['За МКАД', 'от 1 000 ₽'],
      ['Монтаж нашей командой', 'от 5 000 ₽'],
    ],
  },
]

const FREE = ['в цене', 'бесплатно', 'базовая цена']

// «Все» и «Покупка» показывают одни и те же вывески, но в «Покупке» на карточках нет переключателя аренды.
const MODES = [
  { id: 'all', name: 'Все', items: SIGNS },
  { id: 'buy', name: 'Покупка', items: SIGNS },
  { id: 'rent', name: 'Аренда', items: RENTABLE },
]

const countsFor = (items) =>
  Object.fromEntries(CATEGORIES.map((c) => [c.id, items.filter((p) => p.categories.includes(c.id)).length]))
const COUNTS = { all: countsFor(SIGNS), buy: countsFor(SIGNS), rent: countsFor(RENTABLE) }
const MIN_PRICE = Math.min(...SIGNS.map((p) => p.price))
const MIN_RENT = Math.min(...RENTABLE.map((p) => p.rent[0]))

// Два раздела каталога на одном адресе: /catalog — неоновые вывески, /catalog?type=marquee — бегущие строки.
// Старые ссылки вида ?cat=marquee ведут в бегущие строки.
export default function CatalogPage() {
  const [params] = useSearchParams()
  const { hash } = useLocation()
  const type = params.get('type') === 'marquee' || params.get('cat') === 'marquee' ? 'marquee' : 'signs'
  const first = useRef(true)

  // Переход между разделами из меню — на том же адресе, поэтому прокрутку наверх делаем сами.
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    if (!hash) window.scrollTo({ top: 0, behavior: 'instant' })
  }, [type]) // eslint-disable-line react-hooks/exhaustive-deps

  return type === 'marquee' ? <MarqueeCatalog /> : <SignsCatalog />
}

function SignsCatalog() {
  const [params, setParams] = useSearchParams()
  const anchor = useRef(null)
  const bar = useRef(null)
  const thumb = useRef(null)
  const modeBar = useRef(null)
  const modeThumb = useRef(null)

  const mode = MODES.some((m) => m.id === params.get('mode')) ? params.get('mode') : 'all'
  // Категория, в которой нет товаров для текущего режима (бегущих строк в аренде), не показывается.
  const cat = COUNTS[mode][params.get('cat')] ? params.get('cat') : 'all'
  const sort = SORTS.some((s) => s.id === params.get('sort')) ? params.get('sort') : 'popular'
  const pool = mode === 'rent' ? RENTABLE : SIGNS

  useEffect(() => {
    document.title = 'Каталог неоновых вывесок — aristocrat. neon'
  }, [])

  useSlidingThumb(modeBar, modeThumb, mode)
  useSlidingThumb(bar, thumb, cat)

  const list = useMemo(() => {
    const items = cat === 'all' ? pool : pool.filter((p) => p.categories.includes(cat))
    if (sort === 'popular') return items
    // «По запросу» — в конце при любой сортировке по цене.
    const price = (p) => (mode === 'rent' ? p.rent[0] : p.price)
    return [...items].sort((a, b) => {
      if (!price(a) || !price(b)) return !price(a) - !price(b)
      return sort === 'cheap' ? price(a) - price(b) : price(b) - price(a)
    })
  }, [pool, mode, cat, sort])

  const update = (key, value, fallback) => {
    const next = new URLSearchParams(params)
    if (value === fallback) next.delete(key)
    else next.set(key, value)
    setParams(next, { replace: true, preventScrollReset: true })

    // Панель фильтров прилипает к верху — после смены фильтра возвращаемся к началу сетки.
    const header = document.querySelector('.header')?.offsetHeight ?? 78
    const top = anchor.current.getBoundingClientRect().top + window.scrollY - header - 12
    if (window.scrollY > top) window.scrollTo({ top, behavior: 'smooth' })
  }

  return (
    <>
      <CatalogHero
        count={SIGNS.length}
        countLabel={signsWord(SIGNS.length)}
        crumb="Каталог"
        pill={
          mode === 'rent'
            ? `${RENTABLE.length} ${signsWord(RENTABLE.length)} в аренду · от ${formatPrice(MIN_RENT)} в сутки`
            : `${SIGNS.length} ${signsWord(SIGNS.length)} · от ${formatPrice(MIN_PRICE)}`
        }
        title={['Каталог', 'вывесок.']}
        script="для бизнеса и праздника"
        lead="Готовые вывески с нашего производства в Москве. Любую повторим в другом цвете, размере или с вашим текстом, а макет покажем бесплатно до оплаты."
      >
        <Link to="/catalog#signs" className="btn btn--red">
          Выбрать вывеску
          <Arrow />
        </Link>
        <Link to="/#constructor" className="btn btn--ghost">
          Собрать свою
        </Link>
      </CatalogHero>

      <section className="section cat-section" id="signs" aria-label="Вывески">
        <div ref={anchor} />
        <div className="cat-filters">
          <div className="cat-bar cat-bar--mode" role="group" aria-label="Покупка или аренда" ref={modeBar}>
            <span className="cat-bar__thumb" ref={modeThumb} aria-hidden="true" />
            {MODES.map((m) => (
              <button
                key={m.id}
                type="button"
                className={`cat-chip${mode === m.id ? ' is-active' : ''}`}
                aria-pressed={mode === m.id}
                onClick={() => update('mode', m.id, 'all')}
              >
                {m.name} <span className="cat-chip__n">{m.items.length}</span>
              </button>
            ))}
          </div>
          <div className="cat-bar" role="group" aria-label="Категории" ref={bar}>
            <span className="cat-bar__thumb" ref={thumb} aria-hidden="true" />
            <button
              type="button"
              className={`cat-chip${cat === 'all' ? ' is-active' : ''}`}
              aria-pressed={cat === 'all'}
              onClick={() => update('cat', 'all', 'all')}
            >
              Все <span className="cat-chip__n">{pool.length}</span>
            </button>
            {CATEGORIES.filter((c) => COUNTS[mode][c.id]).map((c) => (
              <button
                key={c.id}
                type="button"
                className={`cat-chip${cat === c.id ? ' is-active' : ''}`}
                aria-pressed={cat === c.id}
                onClick={() => update('cat', c.id, 'all')}
              >
                {c.name} <span className="cat-chip__n">{COUNTS[mode][c.id]}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="cat-meta">
          <p className="cat-meta__count" aria-live="polite">
            Показано <strong>{list.length}</strong> {signsWord(list.length)}
            {mode === 'rent' && (
              <span className="cat-meta__note"> · цена аренды за сутки, каждые следующие сутки +500 ₽</span>
            )}
          </p>
          <div className="segmented" role="group" aria-label="Сортировка">
            {SORTS.map((s) => (
              <button
                key={s.id}
                type="button"
                className={sort === s.id ? 'is-active' : ''}
                aria-pressed={sort === s.id}
                onClick={() => update('sort', s.id, 'popular')}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>

        <div className="catalog-grid" key={`${mode}-${cat}-${sort}`}>
          {list.map((p, i) => (
            <ProductCard
              key={p.slug}
              product={p}
              rent={mode === 'rent'}
              rentToggle={mode !== 'buy'}
              delay={(i % 3) * 90}
            />
          ))}
          <Link to="/#constructor" className="catalog-custom" data-reveal data-reveal-delay="90">
            <span className="eyebrow">Не нашли свою?</span>
            <span className="catalog-custom__title">
              Соберите вывеску
              <br />
              со своим текстом
            </span>
            <span className="catalog-custom__script">или логотипом</span>
            <span className="catalog-custom__go">
              В конструктор <Arrow />
            </span>
          </Link>
        </div>
      </section>

      <section className="section" aria-label="Комплектация">
        <SectionTitle
          index="02"
          label="Комплектация"
          title="К любой вывеске"
          script="подберём питание и крепление"
          aside="Эти опции доступны для каждой вывески из каталога. Скажите менеджеру, что нужно, и он учтёт это в заказе."
        />
        <div className="kit">
          {KIT.map((k, i) => (
            <article
              key={k.title}
              className={`kit__card${k.tone ? ` kit__card--${k.tone}` : ''}`}
              data-reveal
              data-reveal-delay={(i % 3) * 90}
            >
              <h3 className="kit__head">
                <span className="kit__n">0{i + 1}</span>
                {k.title}
              </h3>
              <ul className="kit__list">
                {k.items.map(([name, price]) => (
                  <li key={name}>
                    <span>{name}</span>
                    <em className={FREE.includes(price) ? 'is-free' : ''}>{price}</em>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <p className="kit__note" data-reveal>
          Точную стоимость с опциями менеджер подтвердит в мессенджере перед оплатой. Изготовление — от 1 рабочего дня.
        </p>
      </section>

      <CtaBlock />
    </>
  )
}

const MARQUEE_MSG =
  'Здравствуйте! Хочу бегущую строку. Подскажите по размеру и цене — пришлю, где будет висеть и какой текст нужен.'

function MarqueeCatalog() {
  useEffect(() => {
    document.title = 'Бегущие строки — aristocrat. neon'
  }, [])

  return (
    <>
      <CatalogHero
        count={MARQUEES.length}
        countLabel={marqueesWord(MARQUEES.length)}
        crumb="Бегущие строки"
        pill={`${MARQUEES.length} форматов · цена по запросу`}
        title={['Бегущие', 'строки.']}
        script="для витрины и праздника"
        lead="Светодиодные табло с вашим текстом: режим работы, меню, акции, поздравления. Размер, цвет и сообщения подберём под задачу, макет покажем бесплатно."
      >
        <Link to="/catalog?type=marquee#signs" className="btn btn--red">
          Выбрать формат
          <Arrow />
        </Link>
        <button type="button" className="btn btn--ghost" onClick={() => sendOrder('telegram', MARQUEE_MSG)}>
          Рассчитать стоимость
        </button>
      </CatalogHero>

      <section className="section cat-section" id="signs" aria-label="Бегущие строки">
        <div className="cat-meta">
          <p className="cat-meta__count">
            Показано <strong>{MARQUEES.length}</strong> {marqueesWord(MARQUEES.length)}
            <span className="cat-meta__note"> · цена зависит от размера, рассчитаем под вашу задачу</span>
          </p>
        </div>

        <div className="catalog-grid">
          {MARQUEES.map((p, i) => (
            <ProductCard key={p.slug} product={p} delay={(i % 3) * 90} />
          ))}
          <button
            type="button"
            className="catalog-custom"
            data-reveal
            data-reveal-delay="90"
            onClick={() => sendOrder('telegram', MARQUEE_MSG)}
          >
            <span className="eyebrow">Нужен другой формат?</span>
            <span className="catalog-custom__title">
              Сделаем табло
              <br />
              под ваш размер
            </span>
            <span className="catalog-custom__script">и ваш текст</span>
            <span className="catalog-custom__go">
              Обсудить в Telegram <Arrow />
            </span>
          </button>
        </div>
      </section>

      <CtaBlock />
    </>
  )
}

// Первый экран раздела: стекло со светом и крупным неоновым числом, крошки, заголовок и кнопки (children).
function CatalogHero({ count, countLabel, crumb, pill, title, script, lead, children }) {
  return (
    <section className="hero" aria-labelledby="catalog-title">
      <div className="hero__panel hero__panel--compact">
        <div className="hero__glass" aria-hidden="true">
          <div className="hero__light hero__light--red" />
          <div className="hero__light hero__light--cream" />
          <div className="hero__script-neon hero__script-neon--count">{count}</div>
          <div className="hero__ribs">
            {RIBS.map((_, i) => (
              <span key={i} style={{ '--i': i }} />
            ))}
          </div>
          <span className="cat-hero__label">
            {countLabel}
            <br />в каталоге
          </span>
        </div>

        <div className="hero__content">
          <nav className="crumbs hero-in" style={{ '--d': '0ms' }} aria-label="Хлебные крошки">
            <Link to="/">Главная</Link>
            <span>/</span>
            {crumb !== 'Каталог' && (
              <>
                <Link to="/catalog">Каталог</Link>
                <span>/</span>
              </>
            )}
            <span aria-current="page">{crumb}</span>
          </nav>
          <div className="pill hero__pill hero-in" style={{ '--d': '60ms' }}>
            <span className="pill__dot" />
            {pill}
          </div>
          <h1 id="catalog-title" className="hero__title">
            <span className="hero-in" style={{ '--d': '120ms' }}>
              {title[0]}
            </span>
            <span className="hero__title-red hero-in" style={{ '--d': '200ms' }}>
              {title[1]}
            </span>
            <span className="hero__script hero-in" style={{ '--d': '480ms' }}>
              {script}
            </span>
          </h1>
          <p className="hero__lead hero-in" style={{ '--d': '320ms' }}>
            {lead}
          </p>
          <div className="hero__ctas hero-in" style={{ '--d': '400ms' }}>
            {children}
          </div>
        </div>
      </div>
    </section>
  )
}
