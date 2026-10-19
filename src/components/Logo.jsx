import { Link } from 'react-router-dom'

export default function Logo({ size = 'md', onClick }) {
  return (
    <Link to="/" className={`logo logo--${size}`} aria-label="aristocrat. neon — на главную" onClick={onClick}>
      <img src={`${import.meta.env.BASE_URL}img/logo-wordmark.png`} alt="aristocrat." className="logo__mark" />
      <span className="logo__neon">neon</span>
    </Link>
  )
}
