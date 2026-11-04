import { useEffect, useMemo, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

import SectionTitle from '../components/SectionTitle.jsx'
import ProductCard from '../components/ProductCard.jsx'
import CtaBlock from '../components/CtaBlock.jsx'
import { Arrow } from '../components/Hero.jsx'
import { CATEGORIES, PRODUCTS, RENTABLE, formatPrice, signsWord } from '../data/products.js'
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
  { id: 'all', name: 'Все', items: PRODUCTS },
  { id: 'buy', name: 'Покупка', items: PRODUCTS },
  { id: 'rent', name: 'Аренда', items: RENTABLE },
]

const countsFor = (items) =>
  Object.fromEntries(CATEGORIES.map((c) => [c.id, items.filter((p) => p.categories.includes(c.id)).length]))
const COUNTS = { all: countsFor(PRODUCTS), buy: countsFor(PRODUCTS), rent: countsFor(RENTABLE) }
const MIN_PRICE = Math.min(...PRODUCTS.filter((p) => p.price).map((p) => p.price))
const MIN_RENT = Math.min(...RENTABLE.map((p) => p.rent[0]))

export default function CatalogPage() {
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
  const pool = mode === 'rent' ? RENTABLE : PRODUCTS

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
      <section className="hero" aria-labelledby="catalog-title">
        <div className="hero__panel hero__panel--compact">
          <div className="hero__glass" aria-hidden="true">
            <div className="hero__light hero__light--red" />
            <div className="hero__light hero__light--cream" />
            <div className="hero__script-neon hero__script-neon--count">{PRODUCTS.length}</div>
            <div className="hero__ribs">
              {RIBS.map((_, i) => (
                <span key={i} style={{ '--i': i }} />
              ))}
            </div>
            <span className="cat-hero__label">
              {signsWord(PRODUCTS.length)}
              <br />в каталоге
            </span>
          </div>

          <div className="hero__content">
            <nav className="crumbs hero-in" style={{ '--d': '0ms' }} aria-label="Хлебные крошки">
              <Link to="/">Главная</Link>
              <span>/</span>
              <span aria-current="page">Каталог</span>
            </nav>
            <div className="pill hero__pill hero-in" style={{ '--d': '60ms' }}>
              <span className="pill__dot" />
              {mode === 'rent'
                ? `${RENTABLE.length} ${signsWord(RENTABLE.length)} в аренду · от ${formatPrice(MIN_RENT)} в сутки`
                : `${PRODUCTS.length} ${signsWord(PRODUCTS.length)} · от ${formatPrice(MIN_PRICE)}`}
            </div>
            <h1 id="catalog-title" className="hero__title">
              <span className="hero-in" style={{ '--d': '120ms' }}>
                Каталог
              </span>
              <span className="hero__title-red hero-in" style={{ '--d': '200ms' }}>
                вывесок.
              </span>
              <span className="hero__script hero-in" style={{ '--d': '480ms' }}>
                для бизнеса и праздника
              </span>
            </h1>
            <p className="hero__lead hero-in" style={{ '--d': '320ms' }}>
              Готовые вывески с нашего производства в Москве. Любую повторим в другом цвете, размере или с вашим
              текстом, а макет покажем бесплатно до оплаты.
            </p>
            <div className="hero__ctas hero-in" style={{ '--d': '400ms' }}>
              <Link to="/catalog#signs" className="btn btn--red">
                Выбрать вывеску
                <Arrow />
              </Link>
              <Link to="/#constructor" className="btn btn--ghost">
                Собрать свою
              </Link>
            </div>
          </div>
        </div>
      </section>

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
