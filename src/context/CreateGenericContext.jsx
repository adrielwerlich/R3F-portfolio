import { createContext, useContext } from "react"

export const createGenericContext = () => {
  const genericContext = createContext(undefined)

  const useGenericContext = () => {
    
    const contextIsDefined = useContext(genericContext)
    if (!contextIsDefined) {
      throw new Error("useGenericContext must be used within a Provider")
    }
    return contextIsDefined
  }

  return [useGenericContext, genericContext.Provider]
}
