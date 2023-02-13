import React from "react"
import { createGenericContext } from "./CreateGenericContext"
import { useLaptop } from "./useLaptop"

const [useLaptopContext, LaptopContextProvider] = createGenericContext()

const LaptopProvider = ({ children }) => {
  
  const [isClosed, setIsClosed] = useLaptop(true)

  return (
    <LaptopContextProvider value={[isClosed, setIsClosed]}>
      {children}
    </LaptopContextProvider>
  )
}

export { LaptopProvider, useLaptopContext }
