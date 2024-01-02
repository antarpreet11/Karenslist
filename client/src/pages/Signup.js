import React, { useEffect, useContext } from 'react'
import jwt_decode from "jwt-decode"
import { useNavigate } from "react-router-dom"
import { UserContext } from '../App'
import './Signup.css'
import api from '../api/url'

const Signup = () => {

    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);

    const handleCallback = async (response) => {
        const res = jwt_decode(response.credential);
        setUser(res);

        api.get(`/users/${res.email}`).then((api_res) => {
            console.log("User already exists")
            console.log(api_res.statusText)
        }).catch((err) => {
            console.log("User does not exist")
            console.log(err.statusText)
            api.post("/users", 
            { 
                email: res.email,
                name: res.name,
                sub: res.sub
            }
            ).then((api_res) => {
                console.log("User created")
                console.log(api_res.statusText)
            }).catch((err) => {
                console.log(err.statusText)
            })
        })
    
        console.log("Navigating to /")
        navigate("/");
    };

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
           
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className="signup-page">
            <div className='heading-text'>Welcome to Karen's List</div>
            <div id="google-sign-in-button"></div>
        </div>
    )
}

export default Signup