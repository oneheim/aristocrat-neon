import { useEffect } from 'react'

// Fade-in при скролле: элементы с [data-reveal] проявляются, когда входят в экран.
// data-reveal-delay="120" — задержка в мс (для каскада карточек).
export function useReveal(dep) {
  useEffect(() => {
    const els = () => document.querySelectorAll('[data-reveal]:not(.is-revealed)')
    if (!('IntersectionObserver' in window)) {
      els().forEach((el) => el.classList.add('is-revealed'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          const d = e.target.dataset.revealDelay
          if (d) e.target.style.transitionDelay = `${d}ms`
          e.target.classList.add('is-revealed')
          io.unobserve(e.target)
        })
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    )
    const observeAll = () => els().forEach((el) => io.observe(el))
    observeAll()
    // Контент, который появляется позже (смена товара, галерея), тоже подхватываем.
    const mo = new MutationObserver(observeAll)
    mo.observe(document.body, { childList: true, subtree: true })
    return () => {
      io.disconnect()
      mo.disconnect()
    }
  }, [dep])
}
