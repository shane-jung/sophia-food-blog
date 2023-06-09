
import { Link } from "react-router-dom"
export default function RegisterPage(){

    function handleSubmit(event:any){
        event.preventDefault();
        // Check if user already has an account
        // If tthey don't, create a new account for them, load it into database
        fetch(
            "/api/users/create",
            {
                method: 'POST',
                body : event.currentTarget
            }
        ).then(()=>{  //route them back to page they were visiting.
            window.location.href = '/' 
          }
        )
    }
    return (

        <>  
            <form method="POST" onSubmit={handleSubmit} className="user-form" action = "/">
                <h1>Create an Account</h1>
                <h2> Email Address:</h2>
                <input name= "user-email" placeholder="Email Address"></input>
                <h2>Password:</h2>
                <input name= "user-password" placeholder="Password"></input>
                <button className="simple-button">Submit</button>
            </form>
            <p>Already have an account? <Link to='/users/login'>Login</Link></p>
           
        </>
    )
}