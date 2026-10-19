export default function SectionTitle({ index, label, title, script, aside, align = 'left' }) {
  return (
    <div className={`section-title section-title--${align}`}>
      <div className="section-title__main" data-reveal>
        {(index || label) && (
          <div className="eyebrow">
            {index && <span className="eyebrow__num">{index}</span>}
            {label}
          </div>
        )}
        <h2 className="section-title__h">
          {title}
          {script && <span className="section-title__script">{script}</span>}
        </h2>
      </div>
      {aside && (
        <p className="section-title__aside" data-reveal data-reveal-delay="120">
          {aside}
        </p>
      )}
    </div>
  )
}
