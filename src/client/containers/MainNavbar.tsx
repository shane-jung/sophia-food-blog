import { NavLink } from "react-router-dom";

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
          <NavLink to="/category/vegetarian">Vegetarian</NavLink>
        </li>
        <li>
          <NavLink to="/category/lunch">Lunch</NavLink>
        </li>
        <li>
          <NavLink to="/category/dinner">Dinner</NavLink>
        </li>
        <li>
          <NavLink to="/category/dessert">Dessert</NavLink>
        </li>
        <li>
          <NavLink to="/category/snack">Snack</NavLink>
        </li>
      </ul>
    </nav>
  );
}
