import { Outlet } from "react-router";
import { useState, useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";
import { useDispatch } from "react-redux";
import user, {handleLogin, handleLogout } from "../slices/user";
import useAxiosPrivate from "./useAxiosPrivate";
import axios from "../api/axios";


const PersistLogin = () => {

    const [isLoading, setIsLoading] = useState(true);
    const refresh = useRefreshToken();
    const { auth, setAuth } = useAuth();
    const dispatch = useDispatch();

    useEffect(() => {
        const verifyRefreshToken = async () => { 
            console.log('verifying refresh token');
            try {
                const result = await refresh();              
            } catch (err:any) {
                console.log("Logging out")
                dispatch(handleLogout());
            } finally {
                setIsLoading(false);
            }
        }
        auth ? verifyRefreshToken() : verifyRefreshToken();;
    },[]);

    useEffect(() => {
        async function getUser(){
            const getUser = await axios.get(`/users/${auth.user._id}`)
            // console.log("setting user data");
            dispatch(handleLogin(getUser.data));
        }
        if(auth.user) getUser();
    }, [auth])


    return (
       isLoading
        ? <p>Loading...</p> 
        : <Outlet />
    ) 
}

export default PersistLogin;