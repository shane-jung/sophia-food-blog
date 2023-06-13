import { Link, useLocation } from "react-router-dom"
import useAuth from "../utils/useAuth"
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { handleLogout } from "../slices/user";
import { useEffect } from "react";


export default function LoginButton(){
    const {auth, setAuth} = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || "/";
    const username = useSelector((state: any) => state.user.username, (prev, next) => prev == next);
    useEffect(()=>{
        // console.log("USERNAME CHANGED: ", username)
    }, [username])
    const dispatch = useDispatch();
    
    async function logout(){
        console.log('logging out');
        setAuth({})
        dispatch(handleLogout());
        try{ 
            const response = await axios.post(`/users/logout`, {
                email: auth.email,
            }, {withCredentials: true}) 
            console.log(response);

        } catch (error) {
            console.log(error);
        }
        navigate(from, {replace:true})
    }  
    return(
        auth.isAuthenticated 
            ?    <> <p>Welcome, {username}!</p> <button className = "simple-button" onClick = {logout}>Logout</button> </>
            :    <Link  to='/users/login' className="simple-button login-button" state= {{from: window.location.pathname}} >Login</Link>
    )
}