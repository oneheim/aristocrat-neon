import { Link } from 'react-router-dom'

const RIBS = Array.from({ length: 22 })

const STATS = [
  { value: 'от 1 дня', label: 'изготовление на собственном производстве в Москве' },
  { value: '0 ₽', label: 'дизайн-макет и расчёт стоимости до оплаты', accent: true },
  { value: '10 лет', label: 'служит гибкий неон без потери яркости' },
  { value: '14', label: 'цветов свечения, включая RGB-ленту' },
]

export default function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__panel">
        <div className="hero__glass" aria-hidden="true">
          <div className="hero__light hero__light--red" />
          <div className="hero__light hero__light--cream" />
          <div className="hero__script-neon">neon</div>
          <div className="hero__ribs">
            {RIBS.map((_, i) => (
              <span key={i} style={{ '--i': i }} />
            ))}
          </div>
          <span className="hero__plus">+</span>
        </div>

        <div className="hero__content">
          <div className="pill hero__pill hero-in" style={{ '--d': '0ms' }}>
            <span className="pill__dot" />
            Собственное производство · Москва
          </div>
          <h1 id="hero-title" className="hero__title">
            <span className="hero-in" style={{ '--d': '80ms' }}>Свет,</span>
            <span className="hero-in" style={{ '--d': '160ms' }}>который</span>
            <span className="hero__title-red hero-in" style={{ '--d': '240ms' }}>
              продаёт.
            </span>
            <span className="hero__script hero-in" style={{ '--d': '520ms' }}>
              неоновые вывески для бизнеса
            </span>
          </h1>
          <p className="hero__lead hero-in" style={{ '--d': '360ms' }}>
            Вывески из гибкого неона для кафе, салонов, баров и шоурумов. Бесплатный макет, изготовление от одного
            рабочего дня, доставка по всей России.
          </p>
          <div className="hero__ctas hero-in" style={{ '--d': '440ms' }}>
            <Link to="/#constructor" className="btn btn--red">
              Собрать свою вывеску
              <Arrow />
            </Link>
            <Link to="/#catalog" className="btn btn--ghost">
              Смотреть каталог
            </Link>
          </div>
        </div>
      </div>

      <div className="stats">
        {STATS.map((s, i) => (
          <div
            key={s.value}
            className={`stat${s.accent ? ' stat--red' : ''}`}
            data-reveal
            data-reveal-delay={i * 90}
          >
            <span className="stat__value">{s.value}</span>
            <span className="stat__label">{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

export function Arrow({ dir = 'right' }) {
  return (
    <svg className={`arrow arrow--${dir}`} width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      {dir === 'up-right' ? (
        <path d="M5 13 13 5M6.5 5H13v6.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M3 9h12M10 4l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  )
}
