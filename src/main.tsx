import { createRoot } from 'react-dom/client'
import './css/index.css'
import App from './components/App.tsx'
import { BrowserRouter, Routes, Route } from 'react-router'

createRoot(document.getElementById('root')!).render(
   // <StrictMode>
      <BrowserRouter>
         <Routes>
            <Route path="/" element={<App />} />
            <Route path="/:firstParticle" element={<App />} />
            <Route path="/:firstParticle/:secondParticle" element={<App />} />
            <Route path="/:firstParticle/:secondParticle/:thirdParticle" element={<App />} />
         </Routes>
      </BrowserRouter>
   // </StrictMode>
)
