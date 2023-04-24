
import Logo from "../components/Logo"
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
            <Logo/>
            <form method="POST" onSubmit={handleSubmit} className="user-form" action = "/">
                <h1>Make an Account</h1>
                <label> Email Address</label>
                <input name= "user-email" placeholder="Email Address"></input>
                <label>Password</label>
                <input name= "user-password" placeholder="Password"></input>
                <button className="simple-button">Submit</button>
            </form>
           
        </>
    )
}