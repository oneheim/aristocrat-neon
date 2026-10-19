import { Link } from 'react-router-dom'

import { formatPrice } from '../data/products.js'
import { Arrow } from './Hero.jsx'

export default function ProductCard({ product, delay = 0 }) {
  return (
    <Link
      to={`/catalog/${product.slug}`}
      className="product-card"
      style={{ '--glow': product.glow }}
      data-reveal
      data-reveal-delay={delay}
    >
      <div className="product-card__media">
        <img src={product.card} alt={`Неоновая вывеска «${product.name}»`} loading="lazy" width="700" height="700" />
        <span className="product-card__tag">{product.tag}</span>
        <span className="product-card__go" aria-hidden="true">
          <Arrow dir="up-right" />
        </span>
      </div>
      <div className="product-card__body">
        <div>
          <h3 className="product-card__name">{product.name}</h3>
          <span className="product-card__size">{product.size}</span>
        </div>
        <span className="product-card__price">{formatPrice(product.price)}</span>
      </div>
    </Link>
  )
}
