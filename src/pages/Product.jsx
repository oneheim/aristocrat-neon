import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import NotFound from './NotFound.jsx'
import ProductCard from '../components/ProductCard.jsx'
import { Arrow } from '../components/Hero.jsx'
import { TgIcon, WaIcon } from '../components/Constructor.jsx'
import { PRODUCTS, SPECS, formatPrice, productBySlug } from '../data/products.js'
import { colorById } from '../data/colors.js'
import { sendOrder } from '../lib/order.js'

const PERKS = [
  ['Бесплатный макет', 'покажем вывеску в вашем цвете и размере до оплаты'],
  ['От 1 рабочего дня', 'собственное производство в Москве'],
  ['Доставка по России', 'по Москве — 700 ₽, самовывоз бесплатно'],
]

export default function Product() {
  const { slug } = useParams()
  const product = productBySlug(slug)

  if (!product) return <NotFound />
  return <ProductView key={product.slug} product={product} />
}

function ProductView({ product }) {
  const [active, setActive] = useState(0)
  const [colorId, setColorId] = useState(product.defaultColor)
  const color = colorById(colorId)
  const related = PRODUCTS.filter((p) => p.slug !== product.slug).slice(0, 3)

  useEffect(() => {
    document.title = `Неоновая вывеска «${product.name}» — aristocrat. neon`
  }, [product])

  const message = [
    `Здравствуйте! Хочу заказать неоновую вывеску «${product.name}».`,
    `Размер: ${product.size}`,
    `Цвет: ${color.name}`,
    `Цена на сайте: ${formatPrice(product.price)}`,
  ].join('\n')

  return (
    <article className="product" style={{ '--glow': product.glow }}>
      <nav className="crumbs" aria-label="Хлебные крошки">
        <Link to="/">Главная</Link>
        <span>/</span>
        <Link to="/#catalog">Каталог</Link>
        <span>/</span>
        <span aria-current="page">{product.name}</span>
      </nav>

      <div className="product__top">
        <div className="gallery">
          <div className="gallery__main">
            <div className="gallery__halo" aria-hidden="true" />
            {product.images.map((src, i) => (
              <img
                key={src}
                src={src}
                alt={`Неоновая вывеска «${product.name}», фото ${i + 1}`}
                className={i === active ? 'is-active' : ''}
                loading={i === 0 ? 'eager' : 'lazy'}
              />
            ))}
            <div className="gallery__nav">
              <button
                type="button"
                aria-label="Предыдущее фото"
                onClick={() => setActive((a) => (a - 1 + product.images.length) % product.images.length)}
              >
                <Arrow dir="left" />
              </button>
              <span>
                {active + 1} / {product.images.length}
              </span>
              <button
                type="button"
                aria-label="Следующее фото"
                onClick={() => setActive((a) => (a + 1) % product.images.length)}
              >
                <Arrow />
              </button>
            </div>
          </div>
          <div className="gallery__thumbs">
            {product.images.map((src, i) => (
              <button
                key={src}
                type="button"
                className={i === active ? 'is-active' : ''}
                onClick={() => setActive(i)}
                aria-label={`Фото ${i + 1}`}
              >
                <img src={src} alt="" loading="lazy" />
              </button>
            ))}
          </div>
        </div>

        <div className="product__info">
          <span className="pill product-in" style={{ '--d': '0ms' }}>
            <span className="pill__dot" />
            {product.tag}
          </span>
          <h1 className="product__title product-in" style={{ '--d': '80ms' }}>
            {product.name}
          </h1>
          <p className="product__lead product-in" style={{ '--d': '160ms' }}>
            {product.lead}
          </p>

          <div className="product__buy product-in" style={{ '--d': '240ms' }}>
            <div className="product__price-row">
              <span className="product__price">{formatPrice(product.price)}</span>
              <span className="product__size">{product.size}</span>
            </div>

            {product.colors.length > 1 ? (
              <div className="product__colors">
                <span className="cn__label">
                  Цвет свечения <em>{color.name}</em>
                </span>
                <div className="swatches">
                  {product.colors.map((id) => {
                    const c = colorById(id)
                    return (
                      <button
                        key={id}
                        type="button"
                        className={`swatch${colorId === id ? ' is-active' : ''}${c.rgb ? ' swatch--rgb' : ''}`}
                        style={{ '--c': c.hex }}
                        onClick={() => setColorId(id)}
                        aria-label={c.name}
                        title={c.name}
                      />
                    )
                  })}
                </div>
                {colorId !== product.photoColor && (
                  <p className="product__color-note">На фото — {colorById(product.photoColor).name.toLowerCase()}. Перед производством пришлём макет в выбранном цвете.</p>
                )}
              </div>
            ) : (
              <p className="product__color-note">Многоцветная вывеска: цвета элементов — как на фото.</p>
            )}

            <div className="product__ctas">
              <button type="button" className="btn btn--red btn--block" onClick={() => sendOrder('telegram', message)}>
                <TgIcon /> Заказать в Telegram
              </button>
              <button type="button" className="btn btn--ghost btn--block" onClick={() => sendOrder('whatsapp', message)}>
                <WaIcon /> WhatsApp
              </button>
            </div>
            <Link to="/#constructor" className="product__custom">
              Хочу похожую со своим текстом <Arrow />
            </Link>
          </div>

          <ul className="perks product-in" style={{ '--d': '320ms' }}>
            {PERKS.map(([t, d]) => (
              <li key={t}>
                <strong>{t}</strong>
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="product__details">
        <div className="product__about" data-reveal>
          <span className="eyebrow">
            <span className="eyebrow__num">01</span>О вывеске
          </span>
          {product.description.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <div className="fits">
            <span className="fits__label">Подходит для</span>
            <div className="fits__list">
              {product.fits.map((f) => (
                <span key={f} className="tag">
                  {f}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="specs" data-reveal data-reveal-delay="120">
          <div className="specs__head">
            <span>Характеристики</span>
            <span className="specs__script">{product.name}</span>
          </div>
          <dl>
            <div>
              <dt>Размер</dt>
              <dd>{product.size}</dd>
            </div>
            <div>
              <dt>Цвет</dt>
              <dd>{color.name}</dd>
            </div>
            {SPECS.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <section className="related" aria-label="Другие вывески">
        <div className="related__head" data-reveal>
          <h2 className="section-title__h">
            Ещё из каталога
          </h2>
          <Link to="/#catalog" className="btn btn--ghost btn--sm">
            Весь каталог
          </Link>
        </div>
        <div className="catalog-grid catalog-grid--related">
          {related.map((p, i) => (
            <ProductCard key={p.slug} product={p} delay={i * 90} />
          ))}
        </div>
      </section>
    </article>
  )
}
