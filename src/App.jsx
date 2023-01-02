import { useState } from "react"
import reactLogo from "./assets/react.svg"
import "./App.css"

import {
  useGLTF,
  Environment,
  Float,
  PresentationControls,
  ContactShadows,
  Html,
  Text,
} from "@react-three/drei"

function App() {
  const computer = useGLTF(
    "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/macbook/model.gltf"
  )

  return (
    <>
      <Environment preset="city" />

      <color args={["#695b5b"]} attach="background" />

      <PresentationControls
        global
        rotation={[0.1, -0.5, .05]}
        polar={[-0.4, 0.2]}
        azimuth={[-1, 0.75]}
        config={{ mass: 2, tension: 400 }}
        snap={{ mass: 4, tension: 400 }}
      >
        <Float rotationIntensity={0.4}>
          <rectAreaLight 
            width={2.5}
            height={1.65}
            intensity={65}
            color={"blue"}
            rotation={[.1, Math.PI, 0]}
            position={[0, .55, -1.15]}
          />
          <primitive object={computer.scene} position-y={-1.2}>
            <Html 
              transform
              wrapperClass="htmlScreen"
              distanceFactor={1.17}
              position={[0, 1.56, -1.4]}
              rotation-x={-.256}
            >

              <iframe src="https://adriel-portf.web.app" />

            </Html>
          </primitive>
          <Text
            font="./bangers-v20-latin-regular.woff"
            fontSize={.7}
            position={[2,.75,.75]}
            rotation-y={-1.25}
            maxWidth={2}
            textAlign="left"
            
          >
            Adriel Werlich
          </Text>
        </Float>
      </PresentationControls>

      <ContactShadows 
        position={-4} 
        opacity={1.4}
        scale={20}
        blur={2}  
      />
    </>
  )
}

export default App
