
import { NavLink } from 'react-router-dom';
import useAuth from '../utils/useAuth';

export default function MainNavbar() {
    const { auth } = useAuth();
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
                { auth?.roles?.find((role:any) => role == 1000) &&
                    <li>
                        <NavLink to="/recipes/create">Create New Recipe</NavLink>
                    </li>
                }
            </ul>
        </nav>
    );
}