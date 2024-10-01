import { useContext, useEffect, useState } from "react";
import {Link} from "react-router-dom";
import { UserContext } from "./userContext";

export default function Header(){
  const {setUserInfo,userInfo}=useContext(UserContext);
  useEffect(()=>{
    fetch('http://localhost:4000/profile',{
      credentials:'include',
    }).then(response =>{
      response.json().then(userInfo=>{
        setUserInfo(userInfo);
      })
    })
  },[]);

  function logout(){
    fetch("http://localhost:4000/logout", {
      credentials: 'include',
      method: 'POST',
    });
    setUserInfo(null);
  }
  const username= userInfo?.username;

    return(
        <header>
        <Link to="/" className="logo">Pomajden.ba</Link>
        <nav>
          {username && (
            <>
            <Link to ="/create">Add post</Link>
            <a onClick={logout}>Log out</a>
            </>
          )}
          {!username && (
            <>
              <Link to="/login"><div className="login-btn">Sign in</div></Link>
              <Link to="/register"><div className="register-btn">Sign up</div></Link>
            </>
          )}
          
        </nav>
      </header>
    );
}