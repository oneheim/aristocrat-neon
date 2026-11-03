import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import CtaBlock from '../components/CtaBlock.jsx'
import Lightbox from '../components/Lightbox.jsx'
import { Arrow } from '../components/Hero.jsx'
import { CASES, PHOTO_COUNT } from '../data/cases.js'
import { plural } from '../data/products.js'
import { sendOrder } from '../lib/order.js'
import { useSlidingThumb } from '../lib/useSlidingThumb.js'

const RIBS = Array.from({ length: 22 })
const SHOWN = 5
const MSG = 'Здравствуйте! Хочу обсудить неоновое оформление мероприятия или пространства.'

export default function CasesPage() {
  const [active, setActive] = useState(CASES[0].slug)
  const [view, setView] = useState(null)
  const bar = useRef(null)
  const thumb = useRef(null)
  const items = useRef({})

  useEffect(() => {
    document.title = 'Кейсы: неон для мероприятий и пространств — aristocrat. neon'
  }, [])

  useSlidingThumb(bar, thumb, active)

  // Активный кейс — последний, чей верх уже поднялся выше 40% высоты экрана.
  useEffect(() => {
    let raf = 0
    const check = () => {
      raf = 0
      const line = window.innerHeight * 0.4
      let current = CASES[0].slug
      for (const c of CASES) {
        if (items.current[c.slug].getBoundingClientRect().top <= line) current = c.slug
      }
      setActive(current)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check)
    }
    check()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  // Панель с названиями прилипает к верху — останавливаемся так, чтобы она не закрывала заголовок кейса.
  const goTo = (slug) => {
    const stuck = parseFloat(getComputedStyle(bar.current).top) + bar.current.offsetHeight
    const top = items.current[slug].getBoundingClientRect().top + window.scrollY - stuck - 30
    window.scrollTo({ top, behavior: 'smooth' })
  }

  const closeView = useCallback(() => setView(null), [])

  return (
    <>
      <section className="hero" aria-labelledby="cases-title">
        <div className="hero__panel hero__panel--compact">
          <div className="hero__glass" aria-hidden="true">
            <div className="hero__light hero__light--red" />
            <div className="hero__light hero__light--cream" />
            <div className="hero__script-neon">neon</div>
            <div className="hero__ribs">
              {RIBS.map((_, i) => (
                <span key={i} style={{ '--i': i }} />
              ))}
            </div>
            <span className="cat-hero__label">
              {CASES.length} {plural(CASES.length, ['проект', 'проекта', 'проектов'])}
              <br />
              {PHOTO_COUNT} фото
            </span>
          </div>

          <div className="hero__content">
            <nav className="crumbs hero-in" style={{ '--d': '0ms' }} aria-label="Хлебные крошки">
              <Link to="/">Главная</Link>
              <span>/</span>
              <span aria-current="page">Кейсы</span>
            </nav>
            <div className="pill hero__pill hero-in" style={{ '--d': '60ms' }}>
              <span className="pill__dot" />
              Фестивали · юбилеи · стенды · витрины
            </div>
            <h1 id="cases-title" className="hero__title">
              <span className="hero-in" style={{ '--d': '120ms' }}>
                Большие
              </span>
              <span className="hero__title-red hero-in" style={{ '--d': '200ms' }}>
                проекты.
              </span>
              <span className="hero__script hero-in" style={{ '--d': '480ms' }}>
                где светит наш неон
              </span>
            </h1>
            <p className="hero__lead hero-in" style={{ '--d': '320ms' }}>
              Оформляем неоном мероприятия, витрины и пространства. Беремся за сложные идеи: делаем макет, производим в
              Москве и монтируем на площадке.
            </p>
            <div className="hero__ctas hero-in" style={{ '--d': '400ms' }}>
              <Link to="/cases#list" className="btn btn--red">
                Смотреть проекты
                <Arrow />
              </Link>
              <button type="button" className="btn btn--ghost" onClick={() => sendOrder('telegram', MSG)}>
                Обсудить проект
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="section cat-section cases-list" id="list" aria-label="Проекты">
        <div className="cat-bar" role="group" aria-label="Перейти к проекту" ref={bar}>
          <span className="cat-bar__thumb" ref={thumb} aria-hidden="true" />
          {CASES.map((c) => (
            <button
              key={c.slug}
              type="button"
              className={`cat-chip${active === c.slug ? ' is-active' : ''}`}
              aria-current={active === c.slug ? 'true' : undefined}
              onClick={() => goTo(c.slug)}
            >
              {c.short}
            </button>
          ))}
        </div>

        {CASES.map((c, i) => {
          const tiles = c.photos.slice(0, c.shown ?? SHOWN)
          const rest = c.photos.length - tiles.length
          return (
            <article
              key={c.slug}
              className={`case${i % 2 ? ' case--flip' : ''}`}
              style={{ '--glow': c.glow }}
              ref={(el) => (items.current[c.slug] = el)}
              aria-labelledby={`case-${c.slug}`}
            >
              <span className="case__anchor" id={c.slug} />
              <div className="case__head">
                <div data-reveal>
                  <div className="eyebrow">
                    <span className="eyebrow__num">{String(i + 1).padStart(2, '0')}</span>
                    {c.kind}
                  </div>
                  <h2 className="case__title" id={`case-${c.slug}`}>
                    {c.title}
                  </h2>
                  <p className="case__meta">{c.meta}</p>
                </div>
                <div className="case__about" data-reveal data-reveal-delay="120">
                  <p>{c.text}</p>
                  <ul className="case__tags">
                    {c.tags.map((t) => (
                      <li key={t} className="tag">
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className={`case__grid${tiles.length === 4 ? ' case__grid--4' : ''}`} data-reveal data-reveal-delay="80">
                {tiles.map((p, k) => (
                  <button
                    key={p.src}
                    type="button"
                    className="case__tile"
                    onClick={() => setView({ c, start: k })}
                    aria-label={`${c.title}: открыть фото ${k + 1} из ${c.photos.length}`}
                  >
                    <img
                      src={p.sm}
                      srcSet={`${p.sm} 900w, ${p.src} 1600w`}
                      sizes={k === 0 ? '(max-width: 720px) 100vw, 50vw' : '(max-width: 720px) 50vw, 25vw'}
                      alt=""
                      loading="lazy"
                    />
                    {k === tiles.length - 1 && rest > 0 ? (
                      <span className="case__more">+{rest} фото</span>
                    ) : (
                      <span className="case__zoom" aria-hidden="true">
                        <Arrow dir="up-right" />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </article>
          )
        })}
      </section>

      <CtaBlock />

      {view && <Lightbox title={view.c.title} photos={view.c.photos} start={view.start} onClose={closeView} />}
    </>
  )
}
