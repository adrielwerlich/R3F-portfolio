import React from "react"
import { createGenericContext } from "./CreateGenericContext"
import { useStageLevel } from "./useStageLevel"

const [useStageLevelContext, StageLevelContextProvider] = createGenericContext()

const StageLevelProvider = ({ children }) => {
  const [stageLevel, setStageLevel] = useStageLevel(0)

  return (
    <StageLevelContextProvider value={[stageLevel, setStageLevel]}>
      {children}
    </StageLevelContextProvider>
  )
}

export { StageLevelProvider, useStageLevelContext }
