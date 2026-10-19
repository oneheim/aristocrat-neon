// Цвета свечения гибкого неона — как в линейке производства.
export const NEON_COLORS = [
  { id: 'cold-white', name: 'Белый холодный', hex: '#eaf5ff' },
  { id: 'warm-white', name: 'Белый тёплый', hex: '#ffe2b8' },
  { id: 'neutral-white', name: 'Белый нейтральный', hex: '#fff4e6' },
  { id: 'yellow', name: 'Жёлтый', hex: '#ffe53b' },
  { id: 'orange', name: 'Оранжевый', hex: '#ff8a2b' },
  { id: 'gold', name: 'Золотистый', hex: '#ffc15c' },
  { id: 'red', name: 'Красный', hex: '#ff3b2e' },
  { id: 'pink', name: 'Розовый', hex: '#ff4fa6' },
  { id: 'lilac', name: 'Сиреневый', hex: '#c35cff' },
  { id: 'sky', name: 'Голубой', hex: '#62d9ff' },
  { id: 'blue', name: 'Синий', hex: '#3e6cff' },
  { id: 'aqua', name: 'Морская волна', hex: '#2fe3c3' },
  { id: 'green', name: 'Зелёный', hex: '#41ff70' },
  { id: 'rgb', name: 'Смарт-лента RGB', hex: '#ff4fa6', rgb: true },
]

export const MULTICOLOR = { id: 'multi', name: 'Разноцветный (как на фото)', hex: '#ff4fa6', rgb: true }

export const colorById = (id) =>
  NEON_COLORS.find((c) => c.id === id) || (id === MULTICOLOR.id ? MULTICOLOR : NEON_COLORS[0])
