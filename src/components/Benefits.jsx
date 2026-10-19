import SectionTitle from './SectionTitle.jsx'

const base = import.meta.env.BASE_URL

const ITEMS = [
  {
    n: '01',
    title: 'Останавливает взгляд',
    text: 'Свет замечают первым, даже через витрину с улицы. Вывеска становится точкой, по которой гости находят и запоминают место.',
    tone: 'red',
  },
  {
    n: '02',
    title: 'Создаёт фотозону',
    text: 'Гости снимают неон и отмечают заведение в соцсетях. Это бесплатный контент и охват.',
    tone: 'photo',
    img: `${base}img/signs/angel-wings-1.webp`,
  },
  {
    n: '03',
    title: 'Задаёт атмосферу',
    text: 'Тёплый свет вечером, яркий акцент днём. Неон собирает интерьер и поднимает ощущение уровня места.',
    tone: 'dark',
  },
  {
    n: '04',
    title: 'Работает годами',
    text: 'Гибкий LED-неон не бьётся, не греется, мало потребляет и служит до 10 лет без обслуживания.',
    tone: 'red',
  },
]

export default function Benefits() {
  return (
    <section className="section" aria-label="Почему неон работает на бизнес">
      <SectionTitle
        index="02"
        label="Зачем бизнесу неон"
        title="Сильная вывеска"
        script="меняет поведение гостей"
      />
      <div className="benefits">
        <div className="benefits__cols" aria-hidden="true">
          {ITEMS.map((i) => (
            <span key={i.n} />
          ))}
        </div>
        {ITEMS.map((it, i) => (
          <article
            key={it.n}
            className={`benefit benefit--${it.tone}`}
            style={{ '--row': i }}
            data-reveal
            data-reveal-delay={i * 110}
          >
            {it.img && <img src={it.img} alt="" loading="lazy" className="benefit__img" />}
            <span className="benefit__n">{it.n}</span>
            <h3 className="benefit__title">{it.title}</h3>
            <p className="benefit__text">{it.text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
