import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import { Arrow } from './Hero.jsx'

// Просмотр фото на весь экран: стрелки, свайп, Esc. Рендерится в body,
// чтобы перекрыть шапку: у <main> во время анимации появления свой контекст наложения.
export default function Lightbox({ title, photos, start = 0, onClose }) {
  const [i, setI] = useState(start)
  const closeBtn = useRef(null)
  const touchX = useRef(0)
  const n = photos.length
  const step = (d) => setI((k) => (k + d + n) % n)

  useEffect(() => {
    const prev = document.activeElement
    closeBtn.current.focus()
    document.body.classList.add('is-locked')
    return () => {
      document.body.classList.remove('is-locked')
      prev?.focus?.()
    }
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft') setI((k) => (k - 1 + n) % n)
      else if (e.key === 'ArrowRight') setI((k) => (k + 1) % n)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [n, onClose])

  useEffect(() => {
    for (const d of [1, -1]) new Image().src = photos[(i + d + n) % n].src
  }, [i, n, photos])

  const stop = (e) => e.stopPropagation()

  return createPortal(
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`${title} — фото`}
      onClick={onClose}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        const dx = e.changedTouches[0].clientX - touchX.current
        if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1)
      }}
    >
      <div className="lightbox__bar" onClick={stop}>
        <span className="lightbox__title">{title}</span>
        <span className="lightbox__count">
          {i + 1} / {n}
        </span>
        <button ref={closeBtn} type="button" className="lightbox__close" aria-label="Закрыть" onClick={onClose}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="m4 4 10 10M14 4 4 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <img
        key={photos[i].src}
        className="lightbox__img"
        src={photos[i].src}
        alt={`${title}, фото ${i + 1} из ${n}`}
        onClick={stop}
      />

      {n > 1 && (
        <>
          <button
            type="button"
            className="lightbox__nav lightbox__nav--prev"
            aria-label="Предыдущее фото"
            onClick={(e) => {
              stop(e)
              step(-1)
            }}
          >
            <Arrow dir="left" />
          </button>
          <button
            type="button"
            className="lightbox__nav lightbox__nav--next"
            aria-label="Следующее фото"
            onClick={(e) => {
              stop(e)
              step(1)
            }}
          >
            <Arrow />
          </button>
        </>
      )}
    </div>,
    document.body,
  )
}
