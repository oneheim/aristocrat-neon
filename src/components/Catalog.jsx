import { Link } from 'react-router-dom'

import SectionTitle from './SectionTitle.jsx'
import ProductCard from './ProductCard.jsx'
import { FEATURED, PRODUCTS, signsWord } from '../data/products.js'
import { Arrow } from './Hero.jsx'

const MORE = PRODUCTS.filter((p) => !p.featured)

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
        {FEATURED.map((p, i) => (
          <ProductCard key={p.slug} product={p} delay={(i % 3) * 90} />
        ))}
        <Link to="/catalog" className="catalog-all" data-reveal>
          <span className="catalog-all__thumbs" aria-hidden="true">
            {MORE.filter((p) => p.card)
              .slice(0, 5)
              .map((p) => (
                <img key={p.slug} src={p.card} alt="" loading="lazy" width="56" height="56" />
              ))}
          </span>
          <span className="catalog-all__text">
            Ещё {MORE.length} {signsWord(MORE.length)} в каталоге
          </span>
          <span className="catalog-all__go">
            Весь каталог <Arrow />
          </span>
        </Link>
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
