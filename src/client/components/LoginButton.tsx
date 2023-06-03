import { Link, useLocation } from "react-router-dom"
import useAuth from "../utils/useAuth"
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
export default function LoginButton(){
    const {auth, setAuth} = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || "/";
    
    async function handleLogout(){
        setAuth({})
        try{ 
            const response = await axios.post(`/users/logout`, {
                email: auth.email,
            }) 

        } catch (error) {
            console.log(error);
        }
        navigate(from, {replace:true})
    }  
    console.log(window.location.pathname)
    return(
        auth.isAuthenticated 
            ?    <> <p>Welcome, {auth.user?.username}!</p> <button className = "simple-button" onClick = {handleLogout}>Logout</button> </>
            :    <Link  to='/users/login' className="simple-button login-button" state= {{from: window.location.pathname}} >Login</Link>
    )
}