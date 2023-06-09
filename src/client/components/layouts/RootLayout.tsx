import MainNavbar from "@/client/containers/MainNavbar"
import Logo from "../Logo"
import { Outlet } from "react-router"
import LoginButton from "../LoginButton"

export default function RootLayout(){
    return(
       
        <div className="main-container">
            <header className="site-header">
                <Logo/>
                <LoginButton />
            </header>
            <MainNavbar />
            <Outlet />
        </div>
        
    )
}