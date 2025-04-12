import { useEffect, useState } from 'react'
import './App.css'
import { Navigate, Outlet, useLoaderData, useNavigate } from 'react-router-dom'
import NavBar from './Components/NavBar'
import { api } from './utilities';

export function App() {
  const [user, setUser] = useState(useLoaderData());
  const [currentError, setCurrentError] = useState('')
  const {navigate} = useNavigate()

  
  useEffect(() => {
    if (user) {
    console.log(user);
    }
  }, [user]);

  useEffect(() => {
    let nullUserUrl = ['user/login/', '/register/']
    let isAllowed = nullUserUrl.includes(location.pathname);
    if (user && isAllowed) {
      Navigate('/');
    } else if (!user && isAllowed) {
      Navigate('/');
    }
    },[location.pathname]);
  

  return (
    <>
    
    <NavBar user = {user} setUser={setUser}/>
    <Outlet context={{user, setUser, currentError, setCurrentError, navigate}} />
    </>
  )

}


export default App