import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="not-found">
      <span className="not-found__code">404</span>
      <h1>Здесь свет не горит</h1>
      <p>Такой страницы нет. Зато в каталоге есть вывески, которые точно светятся.</p>
      <Link to="/#catalog" className="btn btn--red">
        В каталог
      </Link>
    </section>
  )
}
