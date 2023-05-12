import React, { useEffect } from "react";
import { Navigate } from "react-router";
import axios from 'axios';
import { useLocation } from "react-router-dom";

export const Main = () => {

    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
        sessionStorage.setItem("lastPage", window.location.href);
        Navigate({ to: '/login', replace: true });
    }
    else {
        const abc = axios.get("/api/1/" + token, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        }).then((response) => {
            if (response.status != 200) {
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
    console.log(location);

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <a className="navbar-brand" href="/dashboard">FAS</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                <div className="navbar-nav">
                    <a className={"nav-item nav-link " + ((location.pathname === '/dashboard') ? 'active' : '')} href="/dashboard">Dashboard</a>
                    <a className={"nav-item nav-link " + ((location.pathname === '/write')     ? 'active' : '')} href="/write">Write</a>
                    <a className={"nav-item nav-link " + ((location.pathname === '/archive')   ? 'active' : '')} href="/archive">Archive</a>
                </div>
            </div>
        </nav>
    );

};

export default Main;