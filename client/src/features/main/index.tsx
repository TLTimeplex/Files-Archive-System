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
        const abc = axios.get("http://localhost:3000/1/" + token, {
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



    

    //check if the user is logged in
    return (
        <>
            <h1>Hallo</h1>
        </>
    );

};
/*
async function checkLogin() {
    //check if the token is valid
    //send a request to the server to check if the token is valid
    //if the token is not valid, redirect to the login page
    //if the token is valid, no redirect
        

}
*/

export default Main;