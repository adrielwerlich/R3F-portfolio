// This demo is also playable without installation here:
// https://codesandbox.io/s/basic-demo-forked-ebr0x

import { useControls } from "leva"

import type {
  CylinderArgs,
  CylinderProps,
  PlaneProps,
} from "@react-three/cannon"
import { Debug, Physics, useCylinder, usePlane } from "@react-three/cannon"
import { Environment, OrbitControls } from "@react-three/drei"
import { Canvas, useFrame } from "@react-three/fiber"
import { Suspense, useRef } from "react"
import type { Group, Mesh } from "three"
import React from "react"

import { useToggledControl } from "./use-toggled-control"
import Vehicle from "./Vehicle"

function Plane(props: PlaneProps) {
  const [ref] = usePlane(
    () => ({ material: "ground", type: "Static", ...props }),
    useRef<Group>(null)
  )
  const leva = useControls({
    color: "#303030",
    // openX: 0.6,
    // openX: 0.29,
  })
  return (
    <group ref={ref}>
      <mesh receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color={leva.color} />
      </mesh>
    </group>
  )
}

function Pillar(props: CylinderProps) {
  const args: CylinderArgs = [0.7, 0.7, 5, 16]
  const [ref] = useCylinder(
    () => ({
      args,
      mass: 10,
      ...props,
    }),
    useRef<Mesh>(null)
  )
  return (
    <mesh ref={ref} castShadow>
      <cylinderBufferGeometry args={args} />
      <meshNormalMaterial />
    </mesh>
  )
}

const style = {
  color: "white",
  fontSize: "1.2em",
  left: 50,
  position: "absolute",
  top: 20,
} as const

const Carview = () => {
  const ToggledDebug = useToggledControl(Debug, ":")

  // const carref = useRef<Group>(null)

  // useFrame((state) => {
  //   console.log('carview', state)
  // })

  return (
    <>
      <Canvas
        shadows
        camera={{ fov: 50, position: [0, 5, 15], near: 0.1, far: 200 }}
      >
        <fog attach="fog" args={["#171720", 10, 50]} />
        <color attach="background" args={["#7aaeeb"]} />
        <ambientLight intensity={1.2} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.5}
          intensity={2}
          castShadow
          penumbra={0.1}
        />
        <directionalLight
          // ref={light}
          castShadow
          position={[4, 4, 1]}
          intensity={1.5}
          shadow-mapSize={[1024, 1024]}
          shadow-camera-near={1}
          shadow-camera-far={10}
          shadow-camera-top={10}
          shadow-camera-right={10}
          shadow-camera-bottom={-10}
          shadow-camera-left={-10}
        />
        <Physics
          broadphase="SAP"
          defaultContactMaterial={{
            contactEquationRelaxation: 4,
            friction: 1e-3,
          }}
          allowSleep
        >
          <ToggledDebug>
            <Plane rotation={[-Math.PI / 2, 0, 0]} userData={{ id: "floor" }} />
            <Vehicle
              // ref={carref}
              position={[0, 2, 0]}
              rotation={[0, -Math.PI / 4, 0]}
              angularVelocity={[0, 0.7, 0]}
            />
            <Pillar position={[-5, 2.5, -5]} userData={{ id: "pillar-1" }} />
            <Pillar position={[0, 2.5, -5]} userData={{ id: "pillar-2" }} />
            <Pillar position={[5, 2.5, -5]} userData={{ id: "pillar-3" }} />
          </ToggledDebug>
        </Physics>
        <Suspense fallback={null}>
          <Environment preset="night" />
        </Suspense>
        <OrbitControls />
      </Canvas>
      <div style={style}>
        <pre>
          * WASD to drive, space to brake
          <br />r to reset
          <br />? to debug
        </pre>
      </div>
    </>
  )
}

export default Carview
