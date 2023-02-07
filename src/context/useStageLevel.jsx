import { useEffect, useState } from "react"

export const useStageLevel = (newStageLevelValue) => {
  const [stageLevel, setStageLevel] = useState(0)

  useEffect(() => {
    setStageLevel(newStageLevelValue)
  }, [newStageLevelValue])

  return [stageLevel, setStageLevel]
}
