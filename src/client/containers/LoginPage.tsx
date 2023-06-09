
import { Link } from "react-router-dom"
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

            <form className="user-form" onSubmit={handleSubmit}>
                <h1>Login</h1>
                <h2> Email Address:</h2>
                <input name= "user-email" placeholder="Email Address"></input>
                <h2>Password:</h2>
                <input name= "user-password" placeholder="Password"></input>
                <button>Submit</button>
            </form>
            <p>Don't have an account? <Link to='/users/register'>Create an Account</Link></p>
           
        </>
    )
}