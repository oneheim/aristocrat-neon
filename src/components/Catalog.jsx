import { Link } from 'react-router-dom'

import SectionTitle from './SectionTitle.jsx'
import ProductCard from './ProductCard.jsx'
import { PRODUCTS } from '../data/products.js'
import { Arrow } from './Hero.jsx'

export default function Catalog() {
  return (
    <section className="section" id="catalog" aria-label="Каталог вывесок">
      <SectionTitle
        index="01"
        label="Каталог"
        title="Готовые вывески"
        script="в наличии и под заказ"
        aside="Каждую вывеску из каталога можно сделать в другом цвете, размере или с вашим текстом. Цена указана за вывеску на прозрачном акриле по контуру."
      />
      <div className="catalog-grid">
        {PRODUCTS.map((p, i) => (
          <ProductCard key={p.slug} product={p} delay={(i % 3) * 90} />
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
  )
}
