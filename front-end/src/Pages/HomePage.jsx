import React, { useEffect } from 'react'
import { back_end_api } from '../utilities'

export default function HomePage() {

  const test_connect = async() => {
    let response = await back_end_api('user/login/');
    console.log(response.data)
  };

  useEffect(() => {
    test_connect();
  },[])

  return (



    <div>HomePage</div>
  )
}
