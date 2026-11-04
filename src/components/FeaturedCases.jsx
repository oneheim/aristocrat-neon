import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import SectionTitle from './SectionTitle.jsx'
import { Arrow } from './Hero.jsx'
import { CASES } from '../data/cases.js'

// Лента кейсов на главной: вертикальные карточки, листаются стрелками, свайпом и тачпадом.
export default function FeaturedCases() {
  const track = useRef(null)
  const [edge, setEdge] = useState({ start: true, end: false })

  useEffect(() => {
    const el = track.current
    const check = () =>
      setEdge({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth > el.scrollWidth - 8 })
    check()
    el.addEventListener('scroll', check, { passive: true })
    window.addEventListener('resize', check)
    return () => {
      el.removeEventListener('scroll', check)
      window.removeEventListener('resize', check)
    }
  }, [])

  const scroll = (dir) => {
    const el = track.current
    const step = el.querySelector('.fcase').offsetWidth + parseFloat(getComputedStyle(el).columnGap)
    el.scrollBy({ left: dir * step, behavior: 'smooth' })
  }

  return (
    <section className="section" aria-label="Кейсы">
      <SectionTitle
        index="05"
        label="Кейсы"
        title="Кейсы"
        script="где светит наш неон"
        aside="Фестивали, юбилеи компаний, выставочные стенды и витрины ресторанов. Делаем макет, производим и монтируем на площадке."
      />

      <div className="fcases" ref={track} data-reveal>
        {CASES.map((c) => (
          <Link
            key={c.slug}
            to={`/cases#${c.slug}`}
            className="fcase"
            style={{ '--glow': c.glow }}
            aria-label={`${c.title} — смотреть проект`}
          >
            <img
              className="fcase__img"
              src={c.photos[c.cover - 1].src}
              alt=""
              loading="lazy"
              style={c.coverPos ? { objectPosition: c.coverPos } : undefined}
            />
            <span className="fcase__chip">{c.tags.slice(0, 2).join(' · ')}</span>
            <h3 className="fcase__title">{c.title}</h3>
            <span className="fcase__bar">
              <span className="fcase__kind">
                {c.kind}
                <small>{c.meta}</small>
              </span>
              <span className="fcase__go">
                <span className="fcase__go-text">Смотреть проект</span>
                <Arrow />
              </span>
            </span>
          </Link>
        ))}
      </div>

      <div className="fcases__foot">
        <Link to="/cases" className="btn btn--ghost btn--sm">
          Все кейсы
          <Arrow />
        </Link>
        <div className="fcases__arrows">
          <button type="button" aria-label="Предыдущие кейсы" disabled={edge.start} onClick={() => scroll(-1)}>
            <Arrow dir="left" />
          </button>
          <button type="button" aria-label="Следующие кейсы" disabled={edge.end} onClick={() => scroll(1)}>
            <Arrow />
          </button>
        </div>
      </div>
    </section>
  )
}
