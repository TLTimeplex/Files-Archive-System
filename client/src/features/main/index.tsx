import React, { useEffect } from "react";
import { Navigate } from "react-router";
import axios from 'axios';

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
    
    return (
        <>
            <h1>Hallo</h1>
        </>
    );

};

export default Main;