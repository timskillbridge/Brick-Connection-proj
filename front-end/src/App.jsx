import { useEffect, useState } from 'react'
import './App.css'
import { Navigate, Outlet, useLoaderData, useNavigate } from 'react-router-dom'
import NavBar from './Components/NavBar'
import { api } from './utilities';

export function App() {
  const [user, setUser] = useState(useLoaderData()['username']);
  const [spr, setSpr] = useState(useLoaderData()['is_super']);
  const [currentError, setCurrentError] = useState('');


  
  useEffect(() => {
    if (user) {
    console.log(user);
    }
  }, [user]);

  useEffect(() => {
    let nullUserUrl = ['user/login/']
    let isAllowed = nullUserUrl.includes(location.pathname);
    if (user && isAllowed) {
      navigate('/');
    } else if (!user && isAllowed) {
      navigate('/');
    }
    },[location.pathname]);
  

  return (
    <>
    
    <NavBar user = {user} setUser={setUser} spr = {spr} setSpr = {setSpr}/>
    <Outlet context={{user, setUser, currentError, setCurrentError, spr, setSpr}} />
    </>
  )

}


export default App