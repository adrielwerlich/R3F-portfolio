import React from "react"
import { useGLTF, Text, Html } from "@react-three/drei"

import { animated, useSpring } from "@react-spring/three"

import { customPointerEvents } from "../helpers/customPointerEvents"

const DoorMesh = () => {
  const { nodes } = useGLTF("/assets/door.gltf")

  return (
    <mesh
      scale={0.3}
      geometry={nodes.Cube.geometry}
      material={nodes.Cube.material}
      position={[0, 1.34, 0]}
    >
      <mesh
        geometry={nodes.Cube001.geometry}
        material={nodes.Cube001.material}
        position={[-0.69, -0.08, 0.17]}
      >
        <mesh
          geometry={nodes.Cube002.geometry}
          material={nodes.Cube002.material}
          position={[0.53, -1.23, -0.17]}
        />
        <mesh
          geometry={nodes.Plane.geometry}
          material={nodes.Plane.material}
          position={[1.27, 0, 0]}
        />
        <mesh
          geometry={nodes.Sphere.geometry}
          material={nodes.Sphere.material}
          position={[1.31, 0, 0.05]}
        />
      </mesh>
    </mesh>
  )
}

export default function LinkIcon(props) {
  const [isHovered, setHovered] = React.useState(false)

  const spring = useSpring({
    scale: isHovered ? 0.13 : 0.09,
    position: isHovered ? [-0.2, 1.1, 0.25] : [-0.2, 1.1, 0.1],
    constrictedScale: isHovered ? 0.11 : 0.09,
    constrictedPosition: isHovered ? [0, 1.05, 0.15] : [0, 1.05, 0],
    color: isHovered ? "#2885f6" : "white",
    textSize: isHovered ? 1 : 0,
    config: { mass: 1.5, tension: 300 },
  })

  const AnimatedText = animated(Text)

  const AnimatedDoor = animated(DoorMesh)

  return (
    <group {...props} dispose={null} position={[1, 1.3, 1]}>
      <mesh
        position={[-0.125, 1, 0]}
        {...customPointerEvents}
        onPointerOver={(e) => {
          debugger
          // e.stopPropagation()
          // customPointerEvents.onPointerOver()
          setHovered(true)
          
        }}
        onPointerOut={(e) => {
          e.stopPropagation()
          customPointerEvents.onPointerOut()
          console.log("hovered", isHovered)
          // setTimeout(() => {
          // }, 300);
          setHovered(false)
        }}
      >
        <boxGeometry args={[1.6, 1.25, 1.5]} />
        <meshStandardMaterial opacity={1} transparent />
      </mesh>
      <Html>
        <div
          style={{
            color: "white",
            position: "absolute",
            bottom: "26vh",
            right: "3vw",
          }}
        >
          {/* <a href="/car"> */}
          {/* <AnimatedText
            strokeOpacity={0}
            fillOpacity={isHovered ? 1 : 0}
            font={"./fonts/woff/Averta-Standard-Black.woff"}
            color={spring.color}
            fontSize={spring.textSize}
            characters="PlanDesignBuOtmz"
            anchorX={"center"}
            anchorY={"middle"}
            position={[-0.2, 2.5, 0]}
            rotation={[0.122173, 0.296706, 0.03490659]}
          >
          </AnimatedText> */}
            Click to navigate using the car.
          {/* </a> */}
        </div>
      </Html>
      <AnimatedDoor />
    </group>
  )
}

useGLTF.preload("/assets/door.gltf")
