// This demo is also playable without installation here:
// https://codesandbox.io/s/basic-demo-forked-ebr0x

import { useControls } from "leva"
import type {
  BoxBufferGeometryProps,
  MeshProps,
  MeshStandardMaterialProps,
  ThreeEvent,
} from "@react-three/fiber"
import * as THREE from "three"

import type {
  CylinderArgs,
  CylinderProps,
  PlaneProps,
} from "@react-three/cannon"
import {
  Debug,
  useCompoundBody,
  Physics,
  useBox,
  useCylinder,
  usePlane,
  usePointToPointConstraint,
} from "@react-three/cannon"
import { Environment, OrbitControls, useGLTF } from "@react-three/drei"
import { Canvas, useFrame, useLoader } from "@react-three/fiber"
import type { GLTF } from "three-stdlib/loaders/GLTFLoader"
import { GLTFLoader } from "three-stdlib/loaders/GLTFLoader"

import { Suspense, useRef } from "react"
import type { Group, Object3D, Material, Mesh } from "three"
import React from "react"

import { useToggledControl } from "./use-toggled-control"
import Vehicle from "./Vehicle"

function Plane(props: PlaneProps) {
  const [ref] = usePlane(
    () => ({ material: "ground", type: "Static", ...props }),
    useRef<Group>(null)
  )

  return (
    <group ref={ref}>
      <mesh receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#303030" />
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

type BoxProps = Omit<MeshProps, "args"> &
  Pick<BoxBufferGeometryProps, "args"> &
  Pick<MeshStandardMaterialProps, "color" | "opacity" | "transparent">

const Box = React.forwardRef<Mesh, BoxProps>(
  (
    {
      args = [1, 1, 1],
      children,
      color = "white",
      opacity = 1,
      transparent = false,
      ...props
    },
    ref
  ) => {
    return (
      <mesh castShadow receiveShadow ref={ref} {...props}>
        <boxBufferGeometry args={args} />
        <meshStandardMaterial
          color={color}
          opacity={opacity}
          transparent={transparent}
        />
        {children}
      </mesh>
    )
  }
)

interface CupGLTF extends GLTF {
  materials: {
    default: Material
    Liquid: Material
  }
  nodes: {
    "buffer-0-mesh-0": Mesh
    "buffer-0-mesh-0_1": Mesh
  }
}

function Mug() {
  const { nodes, materials } = useLoader(
    GLTFLoader,
    "/models/cup.glb"
  ) as CupGLTF
  const [ref] = useCylinder(
    () => ({
      args: [0.6, 0.6, 1, 16],
      mass: 1,
      position: [9, 0, 0],
      rotation: [Math.PI / 2, 0, 0],
    }),
    useRef<Group>(null)
  )
  const bind = useDragConstraint(ref)
  return (
    <group ref={ref} {...bind} dispose={null}>
      <group scale={[0.005, 0.005, 0.005]}>
        <mesh
          receiveShadow
          castShadow
          material={materials.default}
          geometry={nodes["buffer-0-mesh-0"].geometry}
        />
        <mesh
          receiveShadow
          castShadow
          material={materials.Liquid}
          geometry={nodes["buffer-0-mesh-0_1"].geometry}
        />
      </group>
    </group>
  )
}

function DummyBoy({ position, scale }) {
  const dummy = useGLTF("/assets/characterAdrielFace.glb")
  console.log(dummy, "dummy")
  const [ref] = useCylinder(
    () => ({
      args: [0.6, 0.6, 1, 16],
      mass: 1,
      position: position,
      rotation: [0, 0, 0],
    }),
    useRef<Group>(null)
  )
  const bind = useDragConstraint(ref)

  let mixer
  if (dummy.animations.length) {
    mixer = new THREE.AnimationMixer(dummy.scene)
    // dummy.animations.forEach(clip => {
    const idleClipAnimation = dummy.animations[0]
    const action = mixer.clipAction(idleClipAnimation)
    action.play()
    // });
  }

  useFrame((state, delta) => {
    mixer?.update(delta)
  })

  return (
    <group ref={ref} {...bind} dispose={null}>
      <primitive object={dummy.scene} scale={scale} />
    </group>
  )
}

function Table() {
  const [seat] = useBox(
    () => ({ args: [2.5, 0.25, 2.5], position: [9, 2.1, 0], type: "Static" }),
    useRef<Mesh>(null)
  )
  const [leg1] = useBox(
    // front left leg
    () => ({ args: [0.25, 2, 0.25], position: [7.9, 1, 1.14], type: "Static" }),
    useRef<Mesh>(null)
  )
  const [leg2] = useBox(
    // front right leg
    () => ({
      args: [0.25, 2, 0.25],
      position: [10.1, 1, 1.14],
      type: "Static",
    }),
    useRef<Mesh>(null)
  )
  const [leg3] = useBox(
    // back left leg
    () => ({
      args: [0.25, 2, 0.25],
      position: [7.9, 1, -1.14],
      type: "Static",
    }),
    useRef<Mesh>(null)
  )
  const [leg4] = useBox(
    // back right leg
    () => ({
      args: [0.25, 2, 0.25],
      position: [10.1, 1, -1.14],
      type: "Static",
    }),
    useRef<Mesh>(null)
  )
  return (
    <>
      <Box scale={[2.5, 0.25, 2.5]} ref={seat} />
      <Box scale={[0.25, 2, 0.25]} ref={leg1} />
      <Box scale={[0.25, 2, 0.25]} ref={leg2} />
      <Box scale={[0.25, 2, 0.25]} ref={leg3} />
      <Box scale={[0.25, 2, 0.25]} ref={leg4} />
      <Suspense fallback={null}>
        <Mug />
      </Suspense>
    </>
  )
}
const cursor = React.createRef<Mesh>()
function useDragConstraint(child: React.RefObject<Object3D>) {
  const [, , api] = usePointToPointConstraint(cursor, child, {
    pivotA: [0, 0, 0],
    pivotB: [0, 0, 0],
  })
  // TODO: make it so we can start the constraint with it disabled
  React.useEffect(() => void api.disable(), [])
  const onPointerDown = React.useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    //@ts-expect-error Investigate proper types here.
    e.target.setPointerCapture(e.pointerId)
    api.enable()
  }, [])
  const onPointerUp = React.useCallback(() => api.disable(), [])
  return { onPointerDown, onPointerUp }
}

function Chair() {
  const [ref] = useCompoundBody(
    () => ({
      mass: 1,
      position: [-6, 4, -3],
      shapes: [
        { args: [1.5, 1.5, 0.25], mass: 1, position: [0, 0, 0], type: "Box" },
        {
          args: [1.5, 0.25, 1.5],
          mass: 1,
          position: [0, -1.75, 1.25],
          type: "Box",
        },
        {
          args: [0.25, 1.5, 0.25],
          mass: 10,
          position: [5 + -6.25, -3.5, 0],
          type: "Box",
        },
        {
          args: [0.25, 1.5, 0.25],
          mass: 10,
          position: [5 + -3.75, -3.5, 0],
          type: "Box",
        },
        {
          args: [0.25, 1.5, 0.25],
          mass: 10,
          position: [5 + -6.25, -3.5, 2.5],
          type: "Box",
        },
        {
          args: [0.25, 1.5, 0.25],
          mass: 10,
          position: [5 + -3.75, -3.5, 2.5],
          type: "Box",
        },
      ],
      type: "Dynamic",
    }),
    useRef<Group>(null)
  )
  const bind = useDragConstraint(ref)
  const leva = useControls({
    // color: "#303030",
    // openX: 0.6,
    // openX: 0.29,
    x: -0.65,
    y: -3.5,
    z: 0.05,
    // -.85, -3.5, 0
  })
  // leva.x, leva.y, leva.z
  return (
    <group ref={ref} {...bind}>
      <Box position={[0, -2, 0]} scale={[1.5, 1.5, 0.25]} /> // back
      <Box position={[0, -2.75, 1.15]} scale={[1.5, 0.25, 2]} /> // seat
      <Box position={[-0.65, -3.5, 0.05]} scale={[0.25, 1.5, 0.25]} /> // right
      back leg
      <Box position={[0.65, -3.5, 0]} scale={[0.25, 1.5, 0.25]} /> // left back
      leg
      <Box position={[-0.65, -3.5, 2.1]} scale={[0.25, 1.5, 0.25]} /> // right
      front leg
      <Box position={[0.65, -3.5, 2.1]} scale={[0.25, 1.5, 0.25]} /> // left
      front leg
    </group>
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

            <Chair />
            <Table />
            <DummyBoy position={[3, -1, 4]} scale={0.5} />
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
          <br />c to change camera view
        </pre>
      </div>
    </>
  )
}

export default Carview
