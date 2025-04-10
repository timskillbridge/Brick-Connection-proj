import { useState } from 'react'
import './App.css'
import { Outlet, useOutletContext } from 'react-router-dom'
import NavBar from './Components/NavBar'

export function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    
    <NavBar />
    <Outlet />
    </>
  )

}


export default App