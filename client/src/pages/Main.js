import React, { useEffect, useContext } from 'react'
import { useNavigate } from 'react-router';
import { UserContext } from '../App'

const Main = () => {
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();

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
        <div>
            <div>Welcome {user?.name}</div>
            <div onClick={HandleLogout}>Logout</div>
        </div>
    )
}

export default Main