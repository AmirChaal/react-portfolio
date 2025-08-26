import { createRoot } from 'react-dom/client'
import './css/index.css'
import App from './components/App.tsx'
import { BrowserRouter, Routes, Route } from 'react-router'

createRoot(document.getElementById('root')!).render(
   // <StrictMode>
      <BrowserRouter>
         <Routes>
            <Route path="/" element={<App />} />
            <Route path="/:view" element={<App />} />
            <Route path="/:view/:subView" element={<App />} />
         </Routes>
      </BrowserRouter>
   // </StrictMode>
)
