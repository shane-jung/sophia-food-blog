import { NavLink } from "react-router-dom";
import useAuth from "../utils/useAuth";
import MainNavbar from "./MainNavbar";

export default function HomePage(){
    const { auth } = useAuth();
    return (
        auth?.accessToken && <div>
            <NavLink to="/recipes/create">
                Create New Recipe
            </NavLink>
        </div>

        
       
    );
}