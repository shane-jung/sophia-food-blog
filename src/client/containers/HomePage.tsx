import { NavLink } from "react-router-dom";
import MainNavbar from "./MainNavbar";

export default function HomePage(){
    return (
        <>
            <div>
                <NavLink to="/recipes/create">
                    Create New Recipe
                </NavLink>
            </div>
        </>

        
       
    );
}