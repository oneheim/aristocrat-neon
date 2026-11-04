import SectionTitle from './SectionTitle.jsx'
import { Arrow } from './Hero.jsx'
import { COMPANIES } from '../data/group.js'

export default function Group() {
  return (
    <section className="section" aria-label="Aristocrat Group">
      <SectionTitle
        index="06"
        label="Наши возможности"
        title="Aristocrat Group"
        script="больше, чем неон"
        aside="Неон — часть группы компаний ARISTOCRAT. Если для мероприятия нужно больше, чем вывеска, у нас есть ивент-производство, флористика, аренда декора и 3D-бутафория."
      />
      <ul className="group" data-reveal>
        {COMPANIES.map((c, i) => (
          <li key={c.site}>
            <a className="group__row" href={`https://${c.site}/`} target="_blank" rel="noopener noreferrer">
              <span className="group__num" aria-hidden="true">
                0{i + 1}
              </span>
              <span className="group__thumb" aria-hidden="true">
                <img src={c.img} alt="" loading="lazy" width="500" height="500" />
              </span>
              <span className="group__name">{c.name}</span>
              <span className="group__site">{c.site}</span>
              <span className="group__go" aria-hidden="true">
                <Arrow />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
