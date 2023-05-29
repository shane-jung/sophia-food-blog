import { Link } from "react-router-dom"
import useAuth from "../utils/useAuth"
import { useNavigate } from "react-router-dom";
export default function LoginButton(){
    const {auth, setAuth} = useAuth();
    const navigate = useNavigate();

    function handleLogout(){
        console.log("logging out")
        setAuth({...auth, accessToken: null})
        navigate("/")
    }
    console.log(auth)
    return(
        auth.accessToken != null 
            ?    <> <p>Welcome, Sophia!</p> <button className = "simple-button" onClick = {handleLogout}>Logout</button> </>
            :    <Link to="/users/login" className="simple-button login-button">Login</Link>
    )
}