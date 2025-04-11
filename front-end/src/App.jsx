import { useEffect, useState } from 'react'
import './App.css'
import { Outlet, useOutletContext } from 'react-router-dom'
import NavBar from './Components/NavBar'
import { api } from './utilities';

export function App() {
  const [user, setUser] = useState(null);

  const test_connection = async () => {
    let response = await back_end_api.get('test');
    console.log(response.data);
  };

  useEffect(() => {
    test_connection();

  },[]);

  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <>
    
    <NavBar />
    <Outlet context={{user, setUser}}/>
    </>
  )

}


export default App