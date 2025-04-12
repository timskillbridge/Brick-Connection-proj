import React, { useEffect } from 'react'
import {useState} from 'react';
import { Form, Button } from 'react-bootstrap'
import { Container, Row, Col, Tab, Tabs, FloatingLabel } from 'react-bootstrap';
import { useOutletContext, useNavigate } from 'react-router-dom'
import { userLogin, confirmUser } from '../utilities'

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const {user, setUser, currentError, setCurrentError, spr, setSpr} = useOutletContext();
const navigate = useNavigate()

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCurrentError('');
    },2000);
    return () => clearTimeout(timeout);
  },[currentError])
  
  return (
    <>
    <div>Login</div>
    <Container className="d-flex justify-content-center " style={{ minHeight: '100vh' }}>
  <Row className="w-100">
    <Col xs={12} sm={10} md={6} lg={4} className="mx-auto">
      <Tabs defaultActiveKey="login" className="mb-3 justify-content-center">
        <Tab eventKey="login" title="Login">
          <Form
            onSubmit={async (e) => {
              e.preventDefault();
              const log = await userLogin(username, password, setCurrentError);
              if (log?.response == 200 ) {
                setUser(log.user)
                setSpr(log.is_super);
                console.log(log.user)
                navigate('/MyPage/');

              }
              }
            }
          >
            <FloatingLabel controlId="floatingInput" label="Username" className="mb-3">
              <Form.Control type="username" placeholder="name@example.com" onChange={(e) => setUsername(e.target.value)}/>
            </FloatingLabel>
            <FloatingLabel controlId="floatingPassword" label="Password">
              <Form.Control type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
            </FloatingLabel>
            <Button
            variant='secondary'
            type='submit'>
              Log me in!
            </Button>
            {currentError}
          </Form>
        </Tab>

        <Tab eventKey="register" title="Register">
          {/* You can build the registration form here */}
          <p>Registration form goes here</p>
        </Tab>
      </Tabs>
    </Col>
  </Row>
</Container>
    
    
    </>

    
  )
}

export default Login