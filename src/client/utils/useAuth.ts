import { useContext } from "react";
import AuthContext from "@/client/contexts/AuthProvider";

const useAuth = () => useContext(AuthContext);

export default useAuth as any;
