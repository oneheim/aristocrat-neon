// Контакты и ссылки. Сейчас здесь заглушки — замените на реальные данные,
// и они обновятся по всему сайту (хедер, футер, кнопки заказа).
export const CONTACTS = {
  phone: '+7 (900) 000-00-00',
  phoneHref: 'tel:+79000000000',
  telegram: 'aristocrat_neon', // username без @
  whatsapp: '79000000000', // номер без + и пробелов
  email: 'hello@aristocrat-neon.ru',
  city: 'Москва',
  address: 'Москва, адрес производства',
  hours: 'Ежедневно с 10:00 до 22:00',
}

export const telegramLink = (text) =>
  `https://t.me/${CONTACTS.telegram}${text ? `?text=${encodeURIComponent(text)}` : ''}`

export const whatsappLink = (text) =>
  `https://wa.me/${CONTACTS.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}`
