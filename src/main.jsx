import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import{BrowserRouter} from 'react-router-dom'
import ShopContextProvider from './contexts/ShopContext.jsx'

// Flags that JS is running so scroll-reveal styles may hide content before it
// animates in. Without it every section renders immediately.
document.documentElement.classList.add('js')

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <ShopContextProvider>
    <App />
  </ShopContextProvider>
  </BrowserRouter>,
)
