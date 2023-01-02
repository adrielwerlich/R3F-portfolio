import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css"

import { Canvas } from "@react-three/fiber"

ReactDOM.createRoot(document.getElementById("root")).render(
  <Canvas
    camera={{
      fov: 45,
      near: 0.1,
      far: 2000,
      position: [-3, 1.5, 2.3],
    }}
  >
    <App />
  </Canvas>
)
