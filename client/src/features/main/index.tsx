import { Navigate } from "react-router";
import axios from 'axios';
import { useLocation } from "react-router-dom";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import React from "react";

export const Main = () => {

  const [isOnline, setIsOnline] = React.useState(navigator.onLine);

  window.addEventListener('online', () => setIsOnline(true));
  window.addEventListener('offline', () => setIsOnline(false));

  if (isOnline) {
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
  }

  const location = useLocation();

  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="/dashboard">FAS {!isOnline ? "offline" : ""}</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link href="/dashboard" className={"nav-item nav-link " + ((location.pathname.match('/dashboard')) ? 'active' : '')}>Dashboard</Nav.Link>
          <Nav.Link href="/report" className={"nav-item nav-link " + ((location.pathname.match('/report')) ? 'active' : '')}>Report</Nav.Link>
          <Nav.Link href="/archive" className={"nav-item nav-link " + ((location.pathname.match('/archive')) ? 'active' : '')}>Archive</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );

};

export default Main;