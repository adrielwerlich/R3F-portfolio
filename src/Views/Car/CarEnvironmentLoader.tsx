import React, { Suspense } from "react"

import Fallback from "../../Components/FallbackLoader"

import Carview from "../../Views/Car/CarView"

// const Carview = React.lazy(async () => {
//   console.log("lazy loading before")
//   await new Promise((resolve) => setTimeout(resolve, 1000))
//   console.log("lazy loading after")

//   return import("../../Views/Car/CarView")
// })


const CarEnvironmentLoader = () => {
  // debugger
  return (
    <>
      <Suspense fallback={<Fallback renderHtml={false} />}>
        <Carview />
      </Suspense>
    </>
  )
}

export default CarEnvironmentLoader
