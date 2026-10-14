import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { BlogContextProvider } from './BlogContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    
      <BrowserRouter>
      
        <Routes>
          <BlogContextProvider>
            <Route path="*" element={ <App /> }></Route>
          </BlogContextProvider>
        </Routes>
      
      </BrowserRouter>
    
  </StrictMode>,
)
