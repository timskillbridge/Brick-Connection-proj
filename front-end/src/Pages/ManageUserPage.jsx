import axios from "axios";
import React, { useState, useEffect } from "react";
import { api } from "../utilities";
import { useNavigate, useOutletContext } from "react-router-dom";
import handleLogout from '../Components/NavBar'

export default function ManageUserPage() {
  const [userprofile, setUserProfile] = useState([]);
  const {currentError, setCurrentError, setSpr, setUser} = useOutletContext()
  const navigate = useNavigate()

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCurrentError('');
    },2000);
    return () => clearTimeout(timeout);
  },[currentError])

  const getUsers = async () => {
    try {
      const { data } = await api.get("user/manage-users/");
      // console.log(data.user)

      setUserProfile(data.user);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const DeleteUser = async (user_id) => {
    const deleteAccount = window.confirm("Deleting this account cannot be undone; all associated sets and assets will be deleted");
    if (!deleteAccount) { 
      return
    } else {
    const selfId = await api.get('user/')
    if(selfId.data.id == user_id) {
      alert("you cannot delete your own account")
      return
    }
    const confirmUser = async (user_id) => {
      const { data } = await api.get(`user/a-user/${user_id}/`);

      // console.log(data.user);
      await api.post(`user/delete/${user_id}/`);
      getUsers();
    };
    confirmUser(user_id);
  }
  };

  const deActivate = async (user_id) => {
    const { data } = await api.get(`user/a-user/${user_id}/`);
    const selfId = await api.get('user/')

    // alert(selfId.data.id)
    if (selfId.data.id == user_id) {
    const selfDeactivate = window.confirm("You are about to deactivate your own account which will log you out; you will not be able to log back in on this account until it has been re-activated");
    if (!selfDeactivate) { 
      return
    } else {
    let isActive = data.user.is_active;
    let response = await api.put(`user/a-user/${user_id}/`, {
      is_active: !isActive,
    })
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      navigate("/");
      setUser(null);
      setSpr(false)
      console.log('user logged out')
  }}

    // console.log(`active status' : ${data.user.is_active}`)
   
    let isActive = data.user.is_active;
    let response = await api.put(`user/a-user/${user_id}/`, {
      is_active: !isActive,
    });
    // console.log(response.data);
    
    getUsers();
  };

  return (
    <>
      <div className = "text-center font">
       <h1>Manage Users</h1>
 
        <p className="text-blue-700">{currentError? currentError:<br />}</p>
        </div>

      <table className="border-separate border border-gray-400 ...">
        <thead>
          <tr>
            <th className="text-center border border-gray-300 px-4">Delete</th>
            <th className="text-center border border-gray-300 px-4">User ID</th>
            <th className="text-center border border-gray-300 px-4">Username</th>
            <th className="text-center border border-gray-300 px-4">token</th>
            <th className="text-center border border-gray-300 px-4">Active</th>
          </tr>
        </thead>
        <tbody>
          {userprofile.map((user, index) => (
            <tr key={user.id}>
              <td className="px-4 text-center border border-gray-300">
                <button
                  className="text-center rounded-md bg-gray-600 text-white px-3 py-2 hover:bg-gray-700 transition"
                  onClick={() => DeleteUser(user.id)}
                >
                  Delete
                </button>
              </td>
              <td className="text-center border border-gray-300">{user.id}</td>
              <td className="text-center border border-gray-300">{user.username}</td>
              <td className="px-1 text-center border border-gray-300">
              {user.token ? (
    <button
      onClick={() => {
        navigator.clipboard.writeText(user.token);
        setCurrentError("Token copied to clipboard!");
      }}
      className="text-blue-600 underline hover:text-blue-800 transition"
    >
      Copy Token
    </button>
  ) : (
    "User not signed-in"
  )}
              </td>
              <td className="text-center border border-gray-300">
                <button
                  className="text-center rounded-md bg-gray-600 text-white px-3 py-2 hover:bg-gray-700 transition"
                  onClick={() => deActivate(user.id)}
                >
                  {user.is_active == true ? "Active" : "Inactive"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
