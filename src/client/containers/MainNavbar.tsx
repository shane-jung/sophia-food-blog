
import { NavLink } from 'react-router-dom';

export default function MainNavbar() {
    return (
        <nav>
            <ul>
                <li>
                    <NavLink to="/">Home</NavLink>
                </li>
                <li>
                    <NavLink to="/recipes">All Recipes</NavLink>
                </li>
                <li>
                    <NavLink to="/about">Breakfast</NavLink>
                </li>
                <li>
                    <NavLink to="/about">Lunch</NavLink>
                </li>
                <li>
                    <NavLink to="/about">Dinner</NavLink>
                </li>
                <li>
                    <NavLink to="/about">Desert</NavLink>
                </li>
                <li>
                    <NavLink to="/about">Snack</NavLink>
                </li>
                <li>
                    <NavLink to="/recipes/create">Create New Recipe</NavLink>
                </li>
            </ul>
        </nav>
    );
}