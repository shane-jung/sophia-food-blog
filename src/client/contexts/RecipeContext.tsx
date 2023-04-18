import { createContext, FunctionComponent, useContext, useState } from 'react'
import { Recipe } from '@/client/types'

interface RecipeContextInterface {
    recipeContext: Recipe, 
    setRecipe(adding: boolean): void
  }
  
  const initialContextValue = {
    addingTempCategory: false,
    setAddingTempCategory: (adding: boolean) => undefined,
  }

const RecipeContext = createContext<RecipeContextInterface>(initialContextValue)

export default function RecipeContext(){
    return(
        <h1>Recipe Context</h1>
    )
}


const RecipeProvider: FunctionComponent = ({ children }) => {
    const [addingTempCategory, setAddingTempCategory] = useState(false)
  
    const value: RecipeContextInterface = {
      addingTempCategory,
      setAddingTempCategory,
    }
  
    return <TempStateContext.Provider value={value}>{children}</TempStateContext.Provider>
  }
  


export { RecipeProvider, useRecipe }
