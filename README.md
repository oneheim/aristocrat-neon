# aristocrat. neon

Сайт-магазин неоновых вывесок для бизнеса: главная (hero, каталог, конструктор, этапы работы, футер), страница каталога `/catalog` (все / покупка / аренда, фильтр по категориям, сортировка, комплектация; аренда — `/catalog?mode=rent`, бегущие строки — `/catalog?cat=marquee`), страницы товаров `/catalog/:slug` и кейсы `/cases` — большие проекты с нашим неоном.

**Сайт:** https://oneheim.github.io/aristocrat-neon/

## Стек

React 19 + Vite + React Router. Бэкенда нет: заказы уходят в Telegram или WhatsApp с готовым текстом заявки.

```bash
npm install
npm run dev      # локально, http://localhost:5173/aristocrat-neon/
npm run build    # сборка в dist/
npm run deploy   # сборка + публикация в ветку gh-pages
```

## Что где менять

| Файл | Что внутри |
|---|---|
| `src/config.js` | Телефон, Telegram, WhatsApp, e-mail, адрес |
| `src/data/products.js` | Каталог: названия, цены, размеры, описания, фото, категории; `featured: true` — шесть вывесок на главной; `rent` — цены аренды на 24 / 48 / 72 часа (есть только у вывесок, которые сдаются в аренду); `MARQUEES` — бегущие строки: вместо фото анимированное табло (`components/MarqueeBoard.jsx`), цена по запросу |
| `src/pages/CatalogPage.jsx` | Страница каталога и блок «Комплектация» (опции и их цены) |
| `src/data/cases.js` | Кейсы: названия, описания, теги, фото; `shown` — сколько фото видно в мозаике; `cover` — фото для карточки в блоке «Избранные кейсы» на главной |
| `src/data/colors.js` | Цвета свечения неона |
| `src/components/Group.jsx` | Блок «Aristocrat Group» на главной: другие компании группы и ссылки на их сайты (фото — `public/img/group/`) |
| `src/data/constructor.js` | Конструктор: типы вывесок, шрифты, подложки, крепления и формула цены (`quote: true` — «рассчитаем индивидуально») |
| `src/components/Constructor.jsx` | Конструктор: превью с перетаскиванием и наклоном слов, загрузка логотипа и фото стены, заявка в мессенджер |
| `src/styles.css` | Все стили; палитра в `:root` (`--cream: #F5F4EC`, `--red: #D43929`) |
| `public/img/signs/` | Фото вывесок (WebP) |
| `public/img/cases/` | Фото кейсов: `<slug>-<n>.webp` для просмотра, `<slug>-<n>-sm.webp` для плиток |

Фото, цены и размеры товаров взяты из каталога aristocrat-neon.ru, фото кейсов — со страницы aristocrat-neon.ru/cases.
