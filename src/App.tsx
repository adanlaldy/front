import { useState } from 'react'
import reactLogo from './assets/react.svg'
import appLogo from '/favicon.svg'
import PWABadge from './PWABadge.tsx'
import './App.css'
import MyRouter from './router/MyRouter.tsx'
function App() {
  return (
    <>
      <MyRouter />
      <PWABadge />
    </>
  )
}

export default App
