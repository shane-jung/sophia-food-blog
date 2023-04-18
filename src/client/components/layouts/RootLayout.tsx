import MainNavbar from "@/client/containers/MainNavbar"
import { Outlet } from "react-router"

export default function RootLayout(){
    return(
        <div>
            <MainNavbar />
            <Outlet />
        </div>
        
    )
}