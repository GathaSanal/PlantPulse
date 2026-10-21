import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import PlantProvider from './context/PlantProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <PlantProvider>
        <App />
      </PlantProvider>
    </BrowserRouter>
  </StrictMode>,
)
