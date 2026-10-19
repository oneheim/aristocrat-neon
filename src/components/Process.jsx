import SectionTitle from './SectionTitle.jsx'

const STEPS = [
  { t: 'Заявка', d: 'Пишете в мессенджер или собираете вывеску в конструкторе. Отвечаем каждый день с 10 до 22.' },
  { t: 'Бесплатный макет', d: 'Дизайнер готовит макет вывески и считает точную стоимость. Оплата — после согласования.' },
  { t: 'Производство', d: 'Изготавливаем на своём производстве в Москве — от одного рабочего дня.' },
  { t: 'Доставка и монтаж', d: 'По Москве привезём сами, по России — транспортной компанией. Монтаж — от 5 000 ₽.' },
]

export default function Process() {
  return (
    <section className="section" id="process" aria-label="Как мы работаем">
      <SectionTitle
        index="04"
        label="Как работаем"
        title="От идеи до света"
        script="за четыре шага"
        aside="Работаем с физическими и юридическими лицами: для компаний — оплата по счёту на расчётный счёт."
      />
      <div className="process" data-reveal>
        <div className="process__track" aria-hidden="true">
          <span className="process__fill" />
        </div>
        <ol className="process__steps">
          {STEPS.map((s, i) => (
            <li key={s.t} className="process__step" data-reveal data-reveal-delay={200 + i * 140}>
              <span className="process__node">{i === STEPS.length - 1 ? '✓' : `0${i + 1}`}</span>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
