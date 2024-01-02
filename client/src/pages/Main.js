import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router';
import { UserContext } from '../App'
import Map from '../components/Map'
import { useJsApiLoader } from '@react-google-maps/api'
import './Main.css'

const Main = () => {
    const { user, setUser } = useContext(UserContext);
    const [currLocation, setCurrLocation] = useState(null);
    const navigate = useNavigate();
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.REACT_APP_MAPSKEY,
        libraries: ['places']
    })

    const HandleProfile = () => {
        navigate("/profile");
    }

    const HandleLogout = () => {
        setUser(null);
    }

    useEffect(() => {
        if(!user) {
            console.log("Navigating to signup")
            navigate("/signup");
        } else {
            navigator.geolocation.getCurrentPosition((position) => {
                setCurrLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                })
            })
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])

    return (
        <div className='main-page'>
            <div className='header'>
                <div onClick={HandleProfile} style={{cursor: 'pointer'}}>Welcome {user?.name}</div>
                <div onClick={HandleLogout} style={{cursor: 'pointer'}}>Logout</div>
            </div>
            {
                !isLoaded || !currLocation ? <div>Loading...</div> :
                <Map location={currLocation}/>
            }
        </div>
    )
}

export default Main