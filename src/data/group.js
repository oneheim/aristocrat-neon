// Другие компании группы — как в блоке «Aristocrat Group» на aristocrat3d.ru, только вместо неона сам 3D.
// Используются в блоке на главной и в подвале.
const img = (name) => `${import.meta.env.BASE_URL}img/group/${name}.webp`

export const COMPANIES = [
  { name: 'Ивент-производство', site: 'aristocratpro.ru', img: img('event') },
  { name: 'Цветочное бюро', site: 'aristocrat-lite.ru', img: img('flowers') },
  { name: 'Аренда декора', site: 'aristocratrent.pifakit.ru', img: img('rent') },
  { name: '3D-печать и бутафория', site: 'aristocrat3d.ru', img: img('3d') },
]
