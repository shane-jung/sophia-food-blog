import { Outlet } from "react-router";
import { useState, useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";


const PersistLogin = () => {

    const [isLoading, setIsLoading] = useState(true);
    const refresh = useRefreshToken();
    const { auth, setAuth } = useAuth();

    useEffect(() => {
        const verifyRefreshToken = async () => { 
            try {
                await refresh();
            } catch (err:any) {
                console.log("Error refreshing token", err);
            } finally {
                setIsLoading(false);
            }
        }
        console.log("persist login")
        !auth?.accessToken ? verifyRefreshToken() : setIsLoading(false);
    }, []);

    // useEffect(() => {   
    //     console.log(auth)
    // }, [isLoading]);
    return (
        <Outlet />
    ) 
}

export default PersistLogin;