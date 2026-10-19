// GitHub Pages не знает про клиентский роутинг: отдаём index.html и на 404,
// чтобы прямые ссылки вида /aristocrat-neon/catalog/candy-bar открывались.
import { copyFileSync, writeFileSync } from 'node:fs'

copyFileSync('dist/index.html', 'dist/404.html')
writeFileSync('dist/.nojekyll', '')
console.log('SPA fallback: dist/404.html, dist/.nojekyll')
