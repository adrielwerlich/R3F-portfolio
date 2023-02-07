import { useEffect, useState } from "react"

export const useLaptop = (newClosedValue) => {
  const [isClosed, setIsClosed] = useState(true)

  useEffect(() => {
    setIsClosed(newClosedValue)
  }, [newClosedValue])

  return [isClosed, setIsClosed]
}
