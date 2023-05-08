
import { Link } from "react-router-dom"
import Logo from "../components/Logo"
export default function LoginPage(){

    function handleSubmit(event:any){
        event.preventDefault();
        fetch(
            "/api/users",
            {
                method: 'GET',
            }
              // Check if user matches any records in the database

        ).then(()=>{  //if they do, route them back to page they were visiting.
            window.location.href = '/' 
          }
        ).catch(()=>{ //if not, keep them on this page and display error message.

        })
    }

    return (

        <>
            <Logo/>
            <form className="user-form" onSubmit={handleSubmit}>
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