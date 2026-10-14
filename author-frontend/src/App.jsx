import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import { BrowserRouter, Route, Link, Routes } from 'react-router-dom';
import './App.css'
import { Homepage } from './Hompage.jsx';

function App() {
  
  return (
    <>
     <Routes>
      <Route path="*" element={<Homepage />} />
     </Routes>
    </>
  )
}

export default App
