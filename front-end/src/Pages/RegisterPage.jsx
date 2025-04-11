import React from 'react'
import { useState, useEffect} from 'react'
import { Form, Button } from 'react-bootstrap'
import { userRegistration } from '../utilities';
import { useOutletContext } from "react-router-dom";

const Register = () => {

  const [email,setEmail] = useState("");
  const [password, setPassword] = useState("")
  const { setUser } = useOutletContext();

  return (

    <>
    <div>Register</div>
    <Form
    onSubmit = {async(e) => [
      e.preventDefault(),
      setUser(await userRegistration(email, password))
    ]}>
      <Form.Group className={'mb-3'} controlId={'formBasicEmai'}>
        <Form.Label>
          Email Address
        </Form.Label>
        <Form.Control
        onChange = {(e) => setEmail(e.target.value)}
        value = {email}
        type="email"
        placeholder = "Enter your Email address"/>
        <Form.Text className={'text-muted'}>
        Your Email is only used for password recover purposes
        </Form.Text>
      </Form.Group>

      <Form.Group className = {'mb-3'} controlId = 'formBasicPassword'>
        <Form.Label>Password</Form.Label>
        <Form.Control
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        type = 'password'
        placeholder='Enter desired password'
        />
        </Form.Group>
        <Button variant ='primary' type='submit'>
          Submit
        </Button>
    </Form>


    </>
  )
}
export default Register