import React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { userLogout } from "../Utility/user_utilities";
import { Nav, Button, Dropdown } from "react-bootstrap";
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';



const NavBar = ({ user, setUser, spr, setSpr }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const worked = await userLogout();
    if (worked) {
      navigate("/");
      setUser(null);
      setSpr(false)
    }
  };
  const handleLogin = () => {
    navigate("/LoginPage/");
  };
  // console.log(spr);

  return (
    <>
<Navbar expand="md" className="relative bg-[#FFD700] text-gray-[#FFD700] flex flex-col px-4 py-2">
<span className="absolute top-0 left-1/2 -translate-x-1/2 transform font-extrabold text-5xl text-[#FFD700] bg-[#DA291C] px-6 py-2 rounded-md shadow-lg border-[6px] border-yellow-300 outline-4 outline-black lego-font tracking-wide">
  Brick-Connection
</span>
  <div className="w-full flex justify-end items-center mb-2">
    {user? (
      <span className="text-md font-medium">
        Signed in as: <p className="underline">{user}</p>
      </span>
    ):
    <Button variant="primary" onClick={handleLogin}>
    Log In
  </Button>}
  </div>

  {/* Bottom row: Main Nav */}
  <Container fluid className="w-full flex justify-between items-center">
    <div className="flex gap-4 text-shadow-lg text-3xl">
      <Nav.Link as={Link} to="/">| Home |</Nav.Link>
      <Nav.Link as={Link} to="/FindSetPage/"> Find a Set |</Nav.Link>

      {user && (
        <Nav.Link as={Link} to="/MyPage/"> My Pool |</Nav.Link>
      )}
      {user && (
        <Nav.Link as={Link} to="/MyCollection/"> My Bricks |</Nav.Link>
      )}
    </div>

    {/* Dropdown (acts like avatar menu) */}
    {user && (
      <Dropdown align="end">
        <Dropdown.Toggle
          variant="link"
          className="text-gray-900 no-underline shadow-none"
        >
          {/* Replace this with an image later */}
          ⚙️
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {spr && (
            <Dropdown.Item as={Link} to="/ManageUserPage/">
              Manage Users
            </Dropdown.Item>
          )}
          <Dropdown.Item onClick={handleLogout}><Button variant="outline-danger" onClick={handleLogout}>
                {`Log Out\n${user}`}
              </Button></Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    )}
  </Container>
</Navbar>










    {/* ------------------------- */}
    {/* <div className = "bg-[#DA291C]">
      <div id="NavBar" className="bg-[#FFD700] text-gray-900 p-0 m-0 leading-none flex flex-col" >
        <ul
          style={{
            listStyleType: "none",
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          <li>
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
          </li>
          <li>
            <Nav.Link as={Link} to="/AboutPage/">
              About
            </Nav.Link>
          </li>
          <li>
            <Nav.Link as={Link} to="/FindSetPage/">
              Find a Set
            </Nav.Link>
          </li>

          {user ? (
            <>
              <li>
                <Nav.Link as={Link} to="/MyPage/">
                  My Page
                </Nav.Link>
              </li>
              <Button variant="outline-danger" onClick={handleLogout}>
                {`Log Out\n${user}`}
              </Button>
            </>
          ) : (
            <>
              <Button variant="primary" onClick={handleLogin}>
                Log In
              </Button>
            </>
          )}
           {spr ? (
            <>
              <li>
                <Nav.Link as={Link} to="/ManageUserPage/">
                  Manage Users
                </Nav.Link>
              </li>
            </>
          ) : ""}
        </ul>
      </div>
      </div> */}
    </>
  );
};
export default NavBar;
