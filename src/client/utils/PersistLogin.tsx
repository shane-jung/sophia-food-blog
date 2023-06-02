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
                console.log("Issue verifying refresh", err);
            } finally {
                setIsLoading(false);
            }
        }
        verifyRefreshToken();
    }, []);
    return (
       isLoading
        ? <p>Loading...</p> 
        : <Outlet />
    ) 
}

export default PersistLogin;