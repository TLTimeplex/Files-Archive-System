import React from "react";
import { Navigate } from "react-router";
import axios from 'axios';
import { useLocation } from "react-router-dom";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

export const Main = () => {

  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  if (!token) {
    sessionStorage.setItem("lastPage", window.location.href);
    Navigate({ to: '/login', replace: true });
  }
  else {
    axios.get("/api/1/" + token, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }).then((response) => {
      if (response.status !== 200) {
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        sessionStorage.setItem("lastPage", window.location.href);
        Navigate({ to: '/login', replace: true });
      }
    }).catch((_) => {
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      sessionStorage.setItem("lastPage", window.location.href);
      window.location.href = "/login";
    });
  }

  const location = useLocation();

  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="/dashboard">FAS</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link href="/dashboard" className={"nav-item nav-link " + ((location.pathname.match('/dashboard')) ? 'active' : '')}>Dashboard</Nav.Link>
          <NavDropdown title="Write" id="basic-nav-dropdown">
            <NavDropdown.Item href="/write">Overview</NavDropdown.Item>
            <NavDropdown.Item href="/write/new">New</NavDropdown.Item>
            <NavDropdown.Item href="/write/edit">Edit</NavDropdown.Item>
          </NavDropdown>
          <Nav.Link href="/archive" className={"nav-item nav-link " + ((location.pathname.match('/archive')) ? 'active' : '')}>Archive</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );

};

export default Main;