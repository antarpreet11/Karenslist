import React, { useEffect, useContext } from 'react'
import { useNavigate } from 'react-router';
import { UserContext } from '../App'
import Map from '../components/Map'
import { useJsApiLoader } from '@react-google-maps/api'
import './Main.css'

const Main = () => {
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.REACT_APP_MAPSKEY,
        libraries: ['places']
    })

    const HandleLogout = () => {
        setUser(null);
    }

    useEffect(() => {
        if(!user) {
            console.log("Navigating to signup")
            navigate("/signup");
        }
    }, [user])


    return (
        <div className='main-page'>
            <div className='header'>
                <div>Welcome {user?.name}</div>
                <div onClick={HandleLogout}>Logout</div>
            </div>
            {
                !isLoaded ? <div>Loading...</div> :
                <Map />
            }
        </div>
    )
}

export default Main