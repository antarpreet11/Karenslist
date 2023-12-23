import React, { useEffect, useContext } from 'react'
import jwt_decode from "jwt-decode"
import { useNavigate } from "react-router-dom"
import { UserContext } from '../App'
import './Signup.css'

const Signup = () => {

    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);

    const handleCallback = (response) => {
        const res = jwt_decode(response.credential);
        console.log(res);
        setUser(res);
        console.log("Navigating to /")
        navigate("/");
    };

    const checkIfUserExits = async () => {
        return true;
    }

    useEffect(() => {
        /* global google */
        google.accounts.id.initialize({
            client_id: process.env.REACT_APP_CLIENTID,
            callback: handleCallback,
        });

        google.accounts.id.renderButton(
            document.getElementById("google-sign-in-button"),
            { theme: "outline", size: "large" }
        );
            
    }, [])

    return (
        <div className="signup-page">
            <div className='heading-text'>Welcome to Karen's List</div>
            <div id="google-sign-in-button"></div>
        </div>
    )
}

export default Signup