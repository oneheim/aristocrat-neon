import { useLayoutEffect } from 'react'

// Стеклянный бегунок под активной кнопкой .cat-chip в панели .cat-bar.
// Пересчитываем и при смене размеров: ширина кнопок меняется, когда догружается шрифт или поворачивается экран.
export function useSlidingThumb(bar, thumb, active) {
  useLayoutEffect(() => {
    const el = bar.current
    const chip = el.querySelector('.cat-chip.is-active')
    const place = () => {
      thumb.current.style.width = `${chip.offsetWidth}px`
      thumb.current.style.transform = `translateX(${chip.offsetLeft}px)`
    }
    place()
    if (el.scrollWidth > el.clientWidth) {
      el.scrollTo({ left: chip.offsetLeft - (el.clientWidth - chip.offsetWidth) / 2, behavior: 'smooth' })
    }
    const ro = new ResizeObserver(place)
    el.querySelectorAll('.cat-chip').forEach((c) => ro.observe(c))
    return () => ro.disconnect()
  }, [bar, thumb, active])
}
