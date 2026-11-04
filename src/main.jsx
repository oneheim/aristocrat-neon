import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import '@fontsource/unbounded/400.css'
import '@fontsource/unbounded/600.css'
import '@fontsource/unbounded/800.css'
import '@fontsource/manrope/400.css'
import '@fontsource/manrope/500.css'
import '@fontsource/manrope/700.css'
import '@fontsource/marck-script/400.css'
import '@fontsource/pacifico/400.css'
import '@fontsource/caveat/600.css'
import '@fontsource/comfortaa/700.css'
import '@fontsource/lobster/400.css'
import '@fontsource/montserrat-alternates/600.css'
import '@fontsource/yeseva-one/400.css'
import '@fontsource/press-start-2p/400.css'
import '@fontsource/rubik-mono-one/400.css'
import './styles.css'

import App from './App.jsx'

const basename = import.meta.env.BASE_URL.replace(/\/$/, '')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
