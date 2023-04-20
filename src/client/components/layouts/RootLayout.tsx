import MainNavbar from "@/client/containers/MainNavbar"
import { Outlet } from "react-router"

export default function RootLayout(){
    return(
        <div className="main-container">
            <MainNavbar />
            <Outlet />
        </div>
        
    )
}