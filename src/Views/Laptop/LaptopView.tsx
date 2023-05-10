import React, { Suspense } from "react"

import LaptopAnimation from "./LaptopAnimation"

import { Canvas } from "@react-three/fiber"


import { StageLevelProvider } from "../../context/StageLevelContext"
import { LaptopProvider } from "../../context/LaptopContext"

import Fallback from "../../Components/FallbackLoader"

// const LaptopAnimation = React.lazy(async () => {
//   console.log("lazy loading before")
//   await new Promise(resolve => setTimeout(resolve, 1000));
//   console.log("lazy loading after")

//   return import('./LaptopAnimation');
// });

const LaptopView = () => {
  return (
    <>
      <Canvas
        camera={{
          fov: 45,
          near: 0.1,
          far: 2000,
          position: [-2, 1, 4],
        }}
      >
        <StageLevelProvider>
          <LaptopProvider>
            <Suspense fallback={<Fallback renderHtml={true} />}>
              <LaptopAnimation />
            </Suspense>
          </LaptopProvider>
        </StageLevelProvider>
      </Canvas>
    </>
  )
}

export default LaptopView
