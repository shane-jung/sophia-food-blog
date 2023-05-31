import { useEffect, useRef, useState } from "react";
import { Link, redirect, useLocation, useNavigate } from "react-router-dom"
import Logo from "../components/Logo"

import axios from '@/client/api/axios';
import useAuth from "../utils/useAuth";

export default function LoginPage(){
    const { auth, setAuth }= useAuth();

    const emailRef = useRef<HTMLInputElement>(null);
    const errRef = useRef<HTMLParagraphElement>(null);  

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errMessage, setErrMessage] = useState('');

    const navigate = useNavigate(); 
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";
    
    useEffect(() =>{
        if(auth.accessToken) navigate(from, {replace: true});
        emailRef.current?.focus();
    }, [])

    useEffect(()=>{
        setErrMessage('');
    }, [email, password])

    const handleSubmit = async (e: any) =>{
        e.preventDefault();
        try{
            const response = await axios.post('/users/login', 
                JSON.stringify({email, password}),
                {
                    headers: {'Content-Type': 'application/json'},
                    withCredentials: true,
                }
            );
            setEmail("")
            setPassword("")
            const accessToken = response?.data?.accessToken;    
            const roles = response?.data?.roles;
            setAuth({accessToken, roles, username: email})
            setPassword("");
            setEmail("");    
            setTimeout( ()=> { navigate(from, {replace: true}) }, 200)
        } catch(err : any) {
            if(!err?.response){
                setErrMessage("No Server Response")
            } else if (err?.response?.status === 401){
                setErrMessage("Incorrect Username or Password");  
            } else {
                setErrMessage(err.response);
            }

            errRef.current?.focus();
            
        }
        
    }
    return (

        <>
            <Logo/>
            <form className="user-form" onSubmit= {handleSubmit}>
                <p 
                    ref = {errRef}
                    id = "error-message" 
                    className = {errMessage ? "error-message" : "offscreen"}
                    aria-live = "assertive" 
                    >{errMessage}</p>
                <h1>Login</h1>
                <label> Email Address</label>
                <input 
                    type="email"
                    id = "email"
                    ref = {emailRef}
                    name= "email" 
                    placeholder="Email Address" 
                    value = {email}
                    onChange = {(e) => setEmail(e.target.value)}
                    autoComplete = "username"
                    required
                />
                <label>Password</label>
                <input 
                    name= "password" 
                    id="password"
                    placeholder="Password" 
                    type="password" 
                    minLength={8}
                    onChange = {(e) => setPassword(e.target.value)}
                    autoComplete = "current-password"
                    required 
                />
                <button>Submit</button>
            </form>
            <p>Don't have an account? <Link to='/users/register'>Make an Account</Link></p>
           
        </>
    )
}