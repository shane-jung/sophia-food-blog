import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import useAuth from "../utils/useAuth";
import MainNavbar from "./MainNavbar";

export default function HomePage(){
    const { auth, setAuth } = useAuth();

    return (
        auth?.roles?.includes(8012) && <div>
            <NavLink to="/recipes/create">
                Create New Recipe
            </NavLink>
        </div>

        
       
    );
}