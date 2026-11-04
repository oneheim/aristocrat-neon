import { useEffect, useId, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

import Logo from './Logo.jsx'
import { CONTACTS } from '../config.js'
import { MARQUEES, SIGNS, signsWord } from '../data/products.js'

// items — пункты выпадающего списка (на телефоне — подпункты в меню).
const NAV = [
  {
    to: '/catalog',
    label: 'Каталог',
    items: [
      { to: '/catalog', label: 'Неоновые вывески', hint: `${SIGNS.length} ${signsWord(SIGNS.length)} в наличии и под заказ` },
      { to: '/catalog?type=marquee', label: 'Бегущие строки', hint: 'Светодиодные табло с вашим текстом' },
    ],
  },
  { to: '/cases', label: 'Кейсы' },
  { to: '/#constructor', label: 'Конструктор' },
  { to: '/#process', label: 'Как работаем' },
  { to: '/#contacts', label: 'Контакты' },
]

// Какой пункт списка сейчас открыт: раздел каталога по адресу, у страницы товара — по самому товару.
function currentItem(location) {
  const { pathname, search } = location
  if (pathname === '/catalog') return /[?&](type|cat)=marquee\b/.test(search) ? '/catalog?type=marquee' : '/catalog'
  const slug = pathname.match(/^\/catalog\/(.+)$/)?.[1]
  if (slug) return MARQUEES.some((m) => m.slug === slug) ? '/catalog?type=marquee' : '/catalog'
  return null
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [location])

  const isActive = (to) => !to.includes('#') && location.pathname.startsWith(to)
  const current = currentItem(location)

  useEffect(() => {
    document.body.classList.toggle('is-locked', open)
  }, [open])

  return (
    <header className={`header${scrolled ? ' is-scrolled' : ''}${open ? ' is-open' : ''}`}>
      <div className="header__inner">
        <Logo />
        <nav className="header__nav" aria-label="Основная навигация">
          {NAV.map((n) =>
            n.items ? (
              <NavDrop key={n.to} item={n} active={isActive(n.to)} current={current} location={location} />
            ) : (
              <Link
                key={n.to}
                to={n.to}
                className={`header__link${isActive(n.to) ? ' is-active' : ''}`}
                aria-current={isActive(n.to) ? 'page' : undefined}
              >
                {n.label}
              </Link>
            ),
          )}
        </nav>
        <div className="header__actions">
          <a href={CONTACTS.phoneHref} className="header__phone">
            {CONTACTS.phone}
          </a>
          <Link to="/#constructor" className="btn btn--cream btn--sm">
            Заказать вывеску
          </Link>
          <button
            type="button"
            className="header__burger"
            aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      <div className="mobile-menu" aria-hidden={!open}>
        <nav>
          {NAV.map((n, i) =>
            n.items ? (
              <div key={n.to} className="mobile-menu__group" style={{ transitionDelay: `${80 + i * 50}ms` }}>
                <span className="mobile-menu__link mobile-menu__link--group">
                  <span className="mobile-menu__num">0{i + 1}</span>
                  {n.label}
                </span>
                {n.items.map((s) => (
                  <Link
                    key={s.to}
                    to={s.to}
                    className={`mobile-menu__sub${current === s.to ? ' is-active' : ''}`}
                  >
                    {s.label}
                    <small>{s.hint}</small>
                  </Link>
                ))}
              </div>
            ) : (
              <Link key={n.to} to={n.to} className="mobile-menu__link" style={{ transitionDelay: `${80 + i * 50}ms` }}>
                <span className="mobile-menu__num">0{i + 1}</span>
                {n.label}
              </Link>
            ),
          )}
        </nav>
        <div className="mobile-menu__foot">
          <a href={CONTACTS.phoneHref}>{CONTACTS.phone}</a>
          <span>{CONTACTS.hours}</span>
        </div>
      </div>
    </header>
  )
}

// Пункт меню с выпадающим списком: открывается наведением мыши, кликом или с клавиатуры, закрывается Esc и кликом мимо.
function NavDrop({ item, active, current, location }) {
  const [open, setOpen] = useState(false)
  const root = useRef(null)
  const button = useRef(null)
  const timer = useRef(0)
  const pointer = useRef('')
  const id = useId()

  useEffect(() => setOpen(false), [location])

  useEffect(() => {
    if (!open) return
    const outside = (e) => {
      if (!root.current.contains(e.target)) setOpen(false)
    }
    const esc = (e) => {
      if (e.key !== 'Escape') return
      setOpen(false)
      button.current.focus()
    }
    document.addEventListener('pointerdown', outside)
    document.addEventListener('keydown', esc)
    return () => {
      document.removeEventListener('pointerdown', outside)
      document.removeEventListener('keydown', esc)
    }
  }, [open])

  useEffect(() => () => clearTimeout(timer.current), [])

  // Только мышь: на тач-экране «наведение» приходит вместе с тапом и тут же закрывало бы список.
  const hover = (show) => (e) => {
    if (e.pointerType !== 'mouse') return
    clearTimeout(timer.current)
    if (show) setOpen(true)
    else timer.current = setTimeout(() => setOpen(false), 180)
  }

  return (
    <div
      className={`header__drop${open ? ' is-open' : ''}`}
      ref={root}
      onPointerEnter={hover(true)}
      onPointerLeave={hover(false)}
      onBlur={(e) => {
        if (!root.current.contains(e.relatedTarget)) setOpen(false)
      }}
    >
      <button
        type="button"
        ref={button}
        className={`header__link header__drop-btn${active ? ' is-active' : ''}`}
        aria-expanded={open}
        aria-controls={id}
        onPointerDown={(e) => (pointer.current = e.pointerType)}
        onClick={(e) => {
          // Мышью список уже открыт наведением — клик его не закрывает. Палец и клавиатура переключают.
          if (e.detail > 0 && pointer.current === 'mouse') setOpen(true)
          else setOpen((v) => !v)
        }}
      >
        {item.label}
        <svg width="12" height="12" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <path d="m4.5 7 4.5 4.5L13.5 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div className="header__menu" id={id}>
        {item.items.map((s) => (
          <Link
            key={s.to}
            to={s.to}
            className={`header__menu-link${current === s.to ? ' is-active' : ''}`}
            aria-current={current === s.to ? 'page' : undefined}
          >
            <span>{s.label}</span>
            <small>{s.hint}</small>
          </Link>
        ))}
      </div>
    </div>
  )
}
