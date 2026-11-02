# aristocrat. neon

Сайт-магазин неоновых вывесок для бизнеса: главная (hero, каталог, конструктор, этапы работы, футер), страница каталога `/catalog` (фильтр по категориям, сортировка, комплектация) и страницы товаров `/catalog/:slug`.

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
| `src/data/products.js` | Каталог: названия, цены, размеры, описания, фото, категории; `featured: true` — шесть вывесок на главной |
| `src/pages/CatalogPage.jsx` | Страница каталога и блок «Комплектация» (опции и их цены) |
| `src/data/colors.js` | Цвета свечения неона |
| `src/components/Constructor.jsx` | Шрифты, размеры, подложки и формула цены конструктора |
| `src/styles.css` | Все стили; палитра в `:root` (`--cream: #F5F4EC`, `--red: #D43929`) |
| `public/img/signs/` | Фото вывесок (WebP) |

Фото, цены и размеры товаров взяты из каталога aristocrat-neon.ru.
