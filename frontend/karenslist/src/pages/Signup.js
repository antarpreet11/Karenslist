import React from 'react'
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from "react-router-dom";
import './Signup.css'

const Signup = () => {
  const navigate = useNavigate();

  const responseMessage = (response) => {
    console.log(response);
    navigate("/main")
  }

  const errorMessage = (response) => {
    console.log('Login Failed');
    console.log(response);
  }

  return (
    <div className="outerBox">
      <div className="headingText">
        Welcome to Karen's List!
      </div>
      <GoogleLogin onSuccess={responseMessage} onError={errorMessage} />
    </div>
  )
}

export default Signup