import { useEffect, useState } from 'react'
import './App.css'
import { Navigate, Outlet, useLoaderData, useNavigate } from 'react-router-dom'
import NavBar from './Components/NavBar'
import { api } from './Utility/user_utilities';

export function App() {
  const [user, setUser] = useState(useLoaderData()['username']);
  const [spr, setSpr] = useState(useLoaderData()['is_super']);
  const [currentError, setCurrentError] = useState('');
  const [manageMiniFigs, setManageMiniFigs] = useState([]);
  const [manageSets, setManageSets] = useState([]);
  const [userFigs, setUserFigs] = useState([]);
  const [userSets, setUserSets] = useState([]);

  const isManaged = (set) => {
    const allsets = [...manageSets, ...manageMiniFigs];
    return `${allsets.filter((ismanaged) => ismanaged.set_num === set.set_num).length}`
  }

  const isDupe = (instance, checkArray) => {
    if(checkArray.filter((item) => item.name === instance.name).length) {
      return true
    }
    else {
      return false
    }
  }

  
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
    <div className="h-4 bg-[#DA291C]"></div>
    <Outlet context={{user, setUser, currentError, setCurrentError, spr, setSpr, manageMiniFigs, setManageMiniFigs, manageSets, setManageSets, userSets, setUserSets, userFigs, setUserFigs, isManaged, isManaged, isDupe}} />
    </>
  )

}


export default App


