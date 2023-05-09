import React, { Suspense } from "react"

import Fallback from "../../Components/FallbackLoader"

// import Carview from "../../Views/Car/CarView"

const Carview = React.lazy(async () => {
  console.log("lazy loading before")
  await new Promise((resolve) => setTimeout(resolve, 2000))
  console.log("lazy loading after")

  return import("../../Views/Car/CarView")
})

import "../../assets/spinnerStyles.css"

const Fallback2 = () => {
  console.log("fallback loading")

  return (
    <>
      {/* <Html position={[-0.03, 0, -1.84]}> */}
      <div
        style={{
          padding: "10px",
          fontWeight: "900",
          fontSize: "3em",
          color: "white",
          width: "200px",
          height: "200px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
        }}
      >
        Loading...
        <div className="lds-spinner">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        {/* <span style={{ color: "blue" }}>text</span> */}
      </div>
      {/* </Html> */}
    </>
  )
}

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
