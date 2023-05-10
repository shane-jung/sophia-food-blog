
import { Link } from "react-router-dom"
import Logo from "../components/Logo"
export default function LoginPage(){


    return (

        <>
            <Logo/>
            <form className="user-form" action="/api/users" method= "GET">
                <h1>Login</h1>
                <label> Email Address</label>
                <input name= "user-email" placeholder="Email Address"></input>
                <label>Password</label>
                <input name= "user-password" placeholder="Password"></input>
                <button>Submit</button>
            </form>
            <p>Don't have an account? <Link to='/users/register'>Make an Account</Link></p>
           
        </>
    )
}