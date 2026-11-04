// Бегущая строка вместо фото товара: LED-табло в рамке, текст едет по кругу.
// Текст повторён дважды — анимация сдвигает дорожку ровно на половину, и шов не виден.
// Скорость постоянная: длительность растёт вместе с длиной текста.
export default function MarqueeBoard({ marquee, color, rgb = false, label }) {
  const { kind, header, text } = marquee
  return (
    <div
      className={`led led--${kind}${rgb || kind === 'wide' ? ' is-rgb' : ''}`}
      style={{ '--led': color, '--led-dur': `${Math.max(8, text.length * 0.42)}s` }}
      role="img"
      aria-label={label ?? `Бегущая строка: ${header ? `${header}. ` : ''}${text}`}
    >
      <div className="led__display">
        {header && <div className="led__header">{header}</div>}
        <div className="led__track">
          <span>{text}</span>
          <span aria-hidden="true">{text}</span>
        </div>
      </div>
    </div>
  )
}
