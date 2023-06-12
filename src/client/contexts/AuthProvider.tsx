import { createContext, useEffect, useState } from "react"

const AuthContext = createContext({});


export const AuthProvider  =  ({children}:any) => {
    const [auth, setAuth] = useState({});
    useEffect(()=>{
        console.log("AUTH CHANGED: ", auth)
    }, [auth])
    return (
        <AuthContext.Provider value = {{auth, setAuth}} >
            {children}
        </AuthContext.Provider >
    ) 
}

export default AuthContext;
