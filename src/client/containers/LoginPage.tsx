import { useEffect, useRef, useState } from "react";
import { Link, redirect, useLocation, useNavigate, useParams } from "react-router-dom"
import Logo from "../components/Logo"

import axios from '@/client/api/axios';
import useAuth from "../utils/useAuth";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { handleLogin } from "../slices/user";

export default function LoginPage(){
    const { auth, setAuth }= useAuth();

    const emailRef = useRef<HTMLInputElement>(null);
    const errRef = useRef<HTMLParagraphElement>(null);  

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errMessage, setErrMessage] = useState('');

    const navigate = useNavigate(); 
    const location = useLocation();
    const from = location.state?.from || "/";

    const dispatch = useDispatch();
    const likedComments = useSelector((state: any) => state.user.likedComments);


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
            console.log("logging in ");
            dispatch(handleLogin(response.data))
            setAuth({user: response.data.user, isAuthenticated: true})

            setPassword("");
            setEmail("");    
            navigate( from, {replace: true});
            
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