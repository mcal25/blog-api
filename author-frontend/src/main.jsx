import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { BlogContextProvider } from './BlogContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    
      <BrowserRouter>
      <BlogContextProvider>
        <Routes>
          
            <Route path="*" element={ <App /> }></Route>
          
        </Routes>
      </BlogContextProvider>
      </BrowserRouter>
    
  </StrictMode>,
)
