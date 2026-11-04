import { Link } from 'react-router-dom'

import Logo from './Logo.jsx'
import { CONTACTS, telegramLink, whatsappLink } from '../config.js'
import { COMPANIES } from '../data/group.js'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="footer" id="contacts">
      <div className="footer__glow" aria-hidden="true" />
      <div className="footer__inner">
        <div className="footer__top">
          <div className="footer__brand" data-reveal>
            <Logo size="lg" />
            <p className="footer__script">свет, который запоминают</p>
          </div>
          <div className="footer__contact" data-reveal data-reveal-delay="100">
            <a href={CONTACTS.phoneHref} className="footer__phone">
              {CONTACTS.phone}
            </a>
            <span className="footer__muted">{CONTACTS.hours}</span>
            <div className="footer__socials">
              <a href={telegramLink()} target="_blank" rel="noopener noreferrer" className="pill-link">
                Telegram
              </a>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="pill-link">
                WhatsApp
              </a>
              <a href={`mailto:${CONTACTS.email}`} className="pill-link">
                {CONTACTS.email}
              </a>
            </div>
          </div>
        </div>

        <div className="footer__cols">
          <div data-reveal>
            <h3 className="footer__h">Aristocrat Group</h3>
            <ul>
              {COMPANIES.map((c) => (
                <li key={c.site}>
                  <a href={`https://${c.site}/`} target="_blank" rel="noopener noreferrer">
                    {c.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div data-reveal data-reveal-delay="80">
            <h3 className="footer__h">Навигация</h3>
            <ul>
              <li><Link to="/catalog">Неоновые вывески</Link></li>
              <li><Link to="/catalog?type=marquee">Бегущие строки</Link></li>
              <li><Link to="/catalog?mode=rent">Аренда</Link></li>
              <li><Link to="/cases">Кейсы</Link></li>
              <li><Link to="/#constructor">Конструктор</Link></li>
              <li><Link to="/#process">Как работаем</Link></li>
              <li><Link to="/#contacts">Контакты</Link></li>
            </ul>
          </div>
          <div data-reveal data-reveal-delay="160">
            <h3 className="footer__h">Доставка</h3>
            <ul className="footer__list">
              <li>Москва — 700 ₽</li>
              <li>За МКАД — от 1 000 ₽</li>
              <li>По России — транспортной компанией</li>
              <li>Самовывоз с производства</li>
            </ul>
          </div>
          <div data-reveal data-reveal-delay="240">
            <h3 className="footer__h">Оплата</h3>
            <ul className="footer__list">
              <li>Картой на сайте или по ссылке</li>
              <li>Наличными или картой при получении</li>
              <li>По счёту для юрлиц</li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <span>© {year} aristocrat. neon</span>
          <span>{CONTACTS.address}</span>
          <span>Производство неоновых вывесок</span>
        </div>
      </div>
    </footer>
  )
}
