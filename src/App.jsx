import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'

import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Product from './pages/Product.jsx'
import NotFound from './pages/NotFound.jsx'
import { useReveal } from './lib/useReveal.js'

const LEAVE_MS = 320

function scrollToHash(hash, smooth) {
  if (!hash) return false
  const el = document.getElementById(decodeURIComponent(hash.slice(1)))
  if (!el) return false
  const top = el.getBoundingClientRect().top + window.scrollY - 84
  window.scrollTo({ top, behavior: smooth ? 'smooth' : 'instant' })
  return true
}

export default function App() {
  const location = useLocation()
  const [shown, setShown] = useState(location)
  const [stage, setStage] = useState('in')
  const timer = useRef(0)

  // Переход между страницами: старая страница гаснет, новая проявляется.
  useEffect(() => {
    if (location.pathname === shown.pathname) {
      if (location.hash !== shown.hash || location.key !== shown.key) {
        setShown(location)
        scrollToHash(location.hash, true)
      }
      return
    }
    setStage('out')
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      setShown(location)
      setStage('in')
    }, LEAVE_MS)
    return () => clearTimeout(timer.current)
  }, [location]) // eslint-disable-line react-hooks/exhaustive-deps

  useLayoutEffect(() => {
    if (!scrollToHash(shown.hash, false)) window.scrollTo({ top: 0, behavior: 'instant' })
  }, [shown.pathname]) // eslint-disable-line react-hooks/exhaustive-deps

  useReveal(shown.pathname)

  return (
    <>
      <Header />
      <main className={`page-stage is-${stage}`} key={shown.pathname}>
        <Routes location={shown}>
          <Route path="/" element={<Home />} />
          <Route path="/catalog/:slug" element={<Product />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </main>
      <div className={`page-curtain is-${stage}`} aria-hidden="true" />
    </>
  )
}
