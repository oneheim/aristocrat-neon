import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

import Logo from './Logo.jsx'
import { CONTACTS } from '../config.js'

const NAV = [
  { to: '/#catalog', label: 'Каталог' },
  { to: '/#constructor', label: 'Конструктор' },
  { to: '/#process', label: 'Как работаем' },
  { to: '/#contacts', label: 'Контакты' },
]

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

  useEffect(() => {
    document.body.classList.toggle('is-locked', open)
  }, [open])

  return (
    <header className={`header${scrolled ? ' is-scrolled' : ''}${open ? ' is-open' : ''}`}>
      <div className="header__inner">
        <Logo />
        <nav className="header__nav" aria-label="Основная навигация">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} className="header__link">
              {n.label}
            </Link>
          ))}
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
          {NAV.map((n, i) => (
            <Link key={n.to} to={n.to} className="mobile-menu__link" style={{ transitionDelay: `${80 + i * 50}ms` }}>
              <span className="mobile-menu__num">0{i + 1}</span>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="mobile-menu__foot">
          <a href={CONTACTS.phoneHref}>{CONTACTS.phone}</a>
          <span>{CONTACTS.hours}</span>
        </div>
      </div>
    </header>
  )
}
