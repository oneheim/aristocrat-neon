import { useEffect } from 'react'

import Hero from '../components/Hero.jsx'
import Marquee from '../components/Marquee.jsx'
import Catalog from '../components/Catalog.jsx'
import Benefits from '../components/Benefits.jsx'
import Constructor from '../components/Constructor.jsx'
import Process from '../components/Process.jsx'
import CtaBlock from '../components/CtaBlock.jsx'

export default function Home() {
  useEffect(() => {
    document.title = 'aristocrat. neon — неоновые вывески для бизнеса'
  }, [])

  return (
    <>
      <Hero />
      <Marquee />
      <Catalog />
      <Benefits />
      <Constructor />
      <Process />
      <CtaBlock />
    </>
  )
}
