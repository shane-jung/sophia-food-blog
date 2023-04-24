import { Link } from "react-router-dom"
export default function LoginButton(){

    return(
        <Link to="/users/login" className="simple-button login-button">Login</Link>
    )
}