import { CONTACTS, telegramLink, whatsappLink } from '../config.js'

// Открывает мессенджер с готовым текстом заявки и дублирует текст в буфер обмена:
// если клиент мессенджера не подставит текст, его можно просто вставить.
export async function sendOrder(channel, text) {
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    /* буфер недоступен — не страшно */
  }
  const url = channel === 'whatsapp' ? whatsappLink(text) : telegramLink(text)
  window.open(url, '_blank', 'noopener')
}

export const managerName = `@${CONTACTS.telegram}`
