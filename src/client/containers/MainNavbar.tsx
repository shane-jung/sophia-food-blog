
import { NavLink } from 'react-router-dom';
import useAuth from '../utils/useAuth';

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
                    <NavLink to="/">Breakfast</NavLink>
                </li>
                <li>
                    <NavLink to="/">Lunch</NavLink>
                </li>
                <li>
                    <NavLink to="/">Dinner</NavLink>
                </li>
                <li>
                    <NavLink to="/">Desert</NavLink>
                </li>
                <li>
                    <NavLink to="/">Snack</NavLink>
                </li>
            </ul>
        </nav>
    );
}