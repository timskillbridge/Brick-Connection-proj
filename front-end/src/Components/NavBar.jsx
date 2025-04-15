import React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { userLogout } from "../utilities";
import { Nav, Button } from "react-bootstrap";

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
      <div id="NavBar">
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
    </>
  );
};
export default NavBar;
