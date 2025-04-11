import React from 'react'
import { useState, useEffect } from "react";
import {Link, useNavigate} from 'react-router-dom'



const NavBar = () => {
const [loggedIn, setLoggedIn] = useState(false)
const navigate = useNavigate()

  return (
    <div id='NavBar'>
            <ul style={{listStyleType: 'none', display:'flex', justifyContent:'space-around'}}>
            <li>
            <Link to={'/'}>Home Page</Link>
            </li>
            <li>
            <Link to={'/AboutPage/'}>About Page</Link>
            </li>
            <li>
            <Link to={'/FindSetPage'}>Find a Set</Link>
            </li>
            
            
            {
            loggedIn?
            <>
            <li>
            <Link to={'/MyPage/'}>My Page</Link>
            </li>
            </>
            :
            <li>
            <Link to={'/LoginPage/'}>Login</Link>
            </li>}
            <li>
            <Link to={'/RegisterPage/'}>Register</Link>
            </li>

        </ul>
    </div>
  )
}
export default NavBar