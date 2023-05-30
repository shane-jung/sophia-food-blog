import { useContext } from "react";
import ViewModeContext from "@/client/contexts/ViewModeProvider"

const useViewMode = () => useContext(ViewModeContext);

export default useViewMode as any;