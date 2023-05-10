import Logo from "../components/Logo"

export default function RegisterPage(){

    return (

        <>  
            <Logo/>
            <form method="POST"  className="user-form" action="/api/users/create" >
                <h1>Make an Account</h1>
                <label> Email Address</label>
                <input name= "user-email" placeholder="Email Address" type="email"></input>
                <label>Password</label>
                <input name= "user-password" placeholder="Password" type="password"></input>
                <button className="simple-button">Submit</button>
            </form>
           
        </>
    )
}

