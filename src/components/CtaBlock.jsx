import { sendOrder } from '../lib/order.js'
import { TgIcon, WaIcon } from './Constructor.jsx'

const MSG = 'Здравствуйте! Нужна неоновая вывеска для бизнеса. Хочу обсудить идею и получить бесплатный макет.'

export default function CtaBlock() {
  return (
    <section className="section cta" aria-label="Заявка на особенную вывеску">
      <div className="cta__panel" data-reveal>
        <div className="cta__ribs" aria-hidden="true" />
        <div className="cta__text">
          <span className="eyebrow eyebrow--light">Индивидуальный заказ</span>
          <h2 className="cta__title">
            Нужна особенная
            <br />
            вывеска?
          </h2>
          <span className="cta__script">логотип, маскот, слоган</span>
        </div>
        <div className="cta__side">
          <p>
            Пришлите логотип или опишите идею. Бесплатно сделаем дизайн-макет и рассчитаем стоимость, а оплата —
            только после согласования.
          </p>
          <div className="cta__btns">
            <button type="button" className="btn btn--cream" onClick={() => sendOrder('telegram', MSG)}>
              <TgIcon /> Написать в Telegram
            </button>
            <button type="button" className="btn btn--ghost-light" onClick={() => sendOrder('whatsapp', MSG)}>
              <WaIcon /> WhatsApp
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
