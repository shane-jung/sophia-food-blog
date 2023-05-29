import { createContext, useState } from "react"
import { _viewMode } from '../enums'

const ViewModeContext = createContext({});


export const ViewModeProvider  =  ({children}:any) => {
    const [viewMode, setViewMode] = useState(_viewMode.VIEWING);
    return (
        <ViewModeContext.Provider value = {{viewMode, setViewMode}} >
            {children}
        </ViewModeContext.Provider >
    ) 
}

export default ViewModeContext;