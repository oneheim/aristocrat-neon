import { useState } from 'react'
import { Link } from 'react-router-dom'

import { categoryName, formatPrice, priceLabel } from '../data/products.js'
import { colorById } from '../data/colors.js'
import { Arrow } from './Hero.jsx'
import MarqueeBoard from './MarqueeBoard.jsx'

// rent — сразу показать цену аренды (каталог в режиме «Аренда»); rentToggle — показывать ли переключатель
// (в режиме «Покупка» его нет). Переключатель лежит поверх ссылки, а не внутри неё: кнопка внутри <a> — невалидная разметка.
export default function ProductCard({ product, delay = 0, rent: rentFirst = false, rentToggle = true }) {
  const [rent, setRent] = useState(rentFirst && Boolean(product.rent))

  return (
    <div
      className={`product-card${rent ? ' is-rent' : ''}`}
      style={{ '--glow': product.glow }}
      data-reveal
      data-reveal-delay={delay}
    >
      <Link to={`/catalog/${product.slug}${rent ? '?mode=rent' : ''}`} className="product-card__link">
        <div className="product-card__media">
          {product.marquee ? (
            <MarqueeBoard
              marquee={product.marquee}
              color={colorById(product.photoColor).hex}
              rgb={colorById(product.photoColor).rgb}
              label={`Бегущая строка «${product.name}»`}
            />
          ) : (
            <img src={product.card} alt={`Неоновая вывеска «${product.name}»`} loading="lazy" width="700" height="700" />
          )}
          <span className="product-card__tag">{categoryName(product)}</span>
          <span className="product-card__go" aria-hidden="true">
            <Arrow dir="up-right" />
          </span>
        </div>
        <div className="product-card__body">
          <div>
            <h3 className="product-card__name">{product.name}</h3>
            <span className="product-card__size">{product.size}</span>
          </div>
          <span className="product-card__price" key={rent ? 'rent' : 'buy'}>
            {rent ? formatPrice(product.rent[0]) : priceLabel(product)}
            {rent && <small> / сутки</small>}
          </span>
        </div>
      </Link>
      {product.rent && rentToggle && (
        <button
          type="button"
          className={`rent-toggle${rent ? ' is-on' : ''}`}
          aria-pressed={rent}
          title={rent ? 'Показать цену покупки' : 'Показать цену аренды'}
          onClick={() => setRent((v) => !v)}
        >
          <span className="rent-toggle__knob" aria-hidden="true" />
          Доступно в аренду
        </button>
      )}
    </div>
  )
}
