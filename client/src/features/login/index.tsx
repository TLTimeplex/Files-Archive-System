import "./login.css"
import background from "./background.jpg"
import React from "react";
import axios from 'axios';

export const Login = () => {

  React.useEffect(() => {
    //get the login form submit button
    const loginForm = document.getElementById("login-form") as HTMLFormElement;
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      //get the username and password input fields
      const username = document.getElementById("input-username") as HTMLInputElement;
      const password = document.getElementById("input-password") as HTMLInputElement;
      //get the keep logged in checkbox
      const keepLoggedIn = document.getElementById("input-keep-logged-in") as HTMLInputElement;
      //send the login request to the server with password as data
      let data = {
        password: password.value,
        keepLoggedIn: keepLoggedIn.checked
      };

      const response = await axios.post("/api/1/login/" + username.value, data, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      if(response.status != 200){
        alert("Login failed");
        return;
      }
      const resData = response.data;
      if(!resData.success){
        const loginInfo = document.getElementById("Login-info") as HTMLInputElement;
        loginInfo.innerHTML = resData.message;
        return;
      }
      if(keepLoggedIn.checked){
        //if the login was successful, save the token in the local storage
        localStorage.setItem("token", resData.message);
      }
      else
      {
        sessionStorage.setItem("token", resData.message);
      }

      //redirect to the last page
      const lastPage = sessionStorage.getItem("lastPage");
      if(lastPage){
        window.location.href = lastPage;
      }else{
        window.location.href = "/";
      }


    });
  });
  
  return (
    <div id="login-wrapper">
      <img src={background} id="login-background" />
      <div id="login">
        <h1 id="login-title">Login</h1>
        <form id="login-form" action="none">

          <input type="text" name="username" id="input-username" placeholder="Username" required autoFocus />

          <input type="password" name="password" id="input-password" placeholder="Password" required />

          <div className="form-check form-switch input-keep-logged-in-wrapper">
            <input className="form-check-input" type="checkbox" name="keep-logged-in" id="input-keep-logged-in" />
            <label htmlFor="input-keep-logged-in">Remember me</label>
          </div>

          <input type="submit" value="Login" id="input-submit" />

        </form>
        <h3 id="Login-info"></h3>
      </div>
    </div>
  );
};

export default Login;