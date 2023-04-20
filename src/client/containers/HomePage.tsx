import { NavLink } from "react-router-dom";

export default function HomePage(){
    return (
        
        <div>
            <h1>Sophia's Food Blog</h1>
            <NavLink to="/recipes/create">
                Create New Recipe
            </NavLink>
        </div>

        
       
    );
}