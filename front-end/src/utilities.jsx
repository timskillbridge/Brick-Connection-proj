import axios from 'axios'
import { Navigate, useNavigate } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';

export const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api/v1/",
  });


  export const userRegistration = async (email, password) => {
    let response = await api.post("user/register/", {
      email: email,
      password: password,
    });
    if (response.status === 201) {
      let { user, token } = response.data;
      // Store the token securely (e.g., in localStorage or HttpOnly cookies)
      localStorage.setItem("token", token);
      api.defaults.headers.common["Authorization"] = `Token ${token}`;
      return user;
    }
    alert(response.data);
    return null;
  };

  export const userLogin = async(username, password, setCurrentError, navigate) => {

    try {
    let response = await api.post('user/login/', {
        username: username,
        password: password,
    });


        let {user, token} = response.data
        localStorage.setItem('token', token);
        api.defaults.headers.common["Authorization"] = `token ${token}`;
        console.log(`Logged in ${user} ${response.status}`, token)
        return {"user":user,
              "response":response.status
        };

  } catch (error) {
    console.error("Login error caught:", error);

    
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
        console.log(`response: ${response.status}, user verified`)
        return true;
      }
    }
    return false;
  };