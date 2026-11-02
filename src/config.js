// Контакты и ссылки. Меняются здесь — и обновляются по всему сайту (хедер, футер, кнопки заказа).
export const CONTACTS = {
  phone: '+7 (963) 87-888-78',
  phoneHref: 'tel:+79638788878',
  telegram: '+79638788878', // username без @ или номер в формате +7…
  whatsapp: '79638788878', // номер без + и пробелов
  email: 'info@aristocrat-neon.ru',
  city: 'Москва',
  address: 'Москва, проспект Будённого, 51к3',
  hours: 'Ежедневно с 10:00 до 22:00',
}

export const telegramLink = (text) =>
  `https://t.me/${CONTACTS.telegram}${text ? `?text=${encodeURIComponent(text)}` : ''}`

export const whatsappLink = (text) =>
  `https://wa.me/${CONTACTS.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}`
