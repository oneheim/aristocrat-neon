const ITEMS = [
  'Кофейни',
  'Салоны красоты',
  'Бары и рестораны',
  'Шоурумы',
  'Барбершопы',
  'Фотостудии',
  'Кондитерские',
  'Фитнес-клубы',
  'Офисы и ресепшн',
  'Event-площадки',
]

export default function Marquee() {
  const row = [...ITEMS, ...ITEMS]
  return (
    <div className="marquee" aria-label="Для кого мы делаем вывески">
      <div className="marquee__track">
        {row.map((t, i) => (
          <span key={i} className="marquee__item" aria-hidden={i >= ITEMS.length}>
            {t}
            <span className="marquee__dot" />
          </span>
        ))}
      </div>
    </div>
  )
}
