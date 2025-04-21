import axios from 'axios'
import { Navigate, useNavigate } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';

export const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api/v1/",
  });


  export const userRegistration = async (username, password, setCurrentError) => {
    const regex = new RegExp("[a-zA-Z].+@[a-zA-Z].+\.[a-zA-Z].+");
    if(!regex.test(username)) {
      setCurrentError('Invalid email address')
      return
    }
    try {
    let response = await api.post("user/register/", {
      email: username,
      password: password,
    });
    if(response.status == 226) {setCurrentError('Username already exists, try another')
      return 
    }
    console.log(`${response.status} ${response['user']}`)
    if (response.status === 201) {
      const {user } = response.data
      return userLogin(user, password, setCurrentError)
    }
     
  }
  
    catch (error) {
    
    setCurrentError(`registration failed, ${error}`)
    return null;
  }  };

  export const userLogin = async(username, password, setCurrentError) => {

    try {
    let response = await api.post('user/login/', {
        username: username,
        password: password,
    });

        let {user, token} = response.data
        let is_super = false
        if (response.data['is_super']) { is_super = true}
        localStorage.setItem('token', token);
        api.defaults.headers.common["Authorization"] = `token ${token}`;
        console.log(`Logged in ${user} ${response.status}`, token)
        console.log('Full response data:', response.data);
        return {"user":username,
              "response":response.status,
              'is_super':is_super
        };

  } catch (error) {
    console.error("Login error caught: ", error);

    
    setCurrentError(`   Invalid username or password`)

    return null
    }
  };

  export const userLogout = async() => {

    const response = await api.post('user/logout/');
    if(response.status == 204) {
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
        console.log('user logged out')

        return true
    }
    console.log('error loggin user out')
    return false
  };

  export const confirmUser = async() => {

    let token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `token ${token}`
      let response = await api.get('user/')
      if (response.status == 200) {
        const {username} = response.data
        let is_super = false
        if(response.data['site administrator']) {is_super = true}

        console.log(`user ${username} | ${response.status} | user verified | super: ${is_super}`)
        return {'username':username,
          'is_super':is_super
        }
      }
    }
    return false;
  };