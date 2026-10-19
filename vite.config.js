import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages: сайт живёт по адресу https://oneheim.github.io/aristocrat-neon/
export default defineConfig({
  plugins: [react()],
  base: '/aristocrat-neon/',
})
