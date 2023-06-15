import { NavLink } from "react-router-dom";
import useAuth from "../utils/useAuth";

export default function HomePage() {
  const { auth } = useAuth();

  return (
    auth?.user?.roles?.includes(8012) && (
      <div>
        <NavLink to="/recipes/create">Create New Recipe</NavLink>
      </div>
    )
  );
}
