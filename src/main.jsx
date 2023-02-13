import React, { StrictMode } from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css"

import {
  StageLevelProvider,
  useStageLevelContext,
} from "./context/StageLevelContext"
import { LaptopProvider } from "./context/LaptopContext"

import { Canvas } from "@react-three/fiber"

ReactDOM.createRoot(document.getElementById("root")).render(
  // <StrictMode></StrictMode>
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
        <App />
      </LaptopProvider>
    </StageLevelProvider>
  </Canvas>
)
