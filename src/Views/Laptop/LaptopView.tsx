import React from "react"

import LaptopAnimation from "./LaptopAnimation"

import { Canvas } from "@react-three/fiber"

import { StageLevelProvider } from "../../context/StageLevelContext"
import { LaptopProvider } from "../../context/LaptopContext"

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
            <LaptopAnimation />
          </LaptopProvider>
        </StageLevelProvider>
      </Canvas>
    </>
  )
}

export default LaptopView
