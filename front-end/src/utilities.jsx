import axios from 'axios'
import { alignPropType } from 'react-bootstrap/esm/types';

export const back_end_api = axios.create({
    baseURL : 'http://127.0.0.1:8000/api/v1/'
})

export const userRegistration = async(email,password) => {
    let response = await back_end_api.post('user/register/',
        {
            email:email,
            password:password
        }
    );
    if (response.status ==200) {
        let { username, token } = response.data;
        alert(JSON.stringify(response.data, null, 2))
        localStorage.setItem('token',token);
        back_end_api.defaults.headers.common['Authorization'] = `token ${token}`
            return username;
    }
    alert(response.data)
    return null
}

