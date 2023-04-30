import React, { RefObject, Suspense, useEffect, useRef } from "react"
// @ts-ignore
import { useSpring, a } from "@react-spring/three"
import { useControls } from "./use-controls"

import {
  useCompoundBody,
  useBox,
  useCylinder,
  usePlane,
  usePointToPointConstraint,
  useSphere,
} from "@react-three/cannon"

import {
  useGLTF,
  useVideoTexture,
  useTexture,
  useAspect,
} from "@react-three/drei"

import type {
  BoxBufferGeometryProps,
  MeshProps,
  MeshStandardMaterialProps,
  ThreeEvent,
} from "@react-three/fiber"
import * as THREE from "three"
import type { Group, Object3D, Material, Mesh } from "three"
import { useFrame, useLoader } from "@react-three/fiber"
import type { GLTF } from "three-stdlib/loaders/GLTFLoader"
import { GLTFLoader } from "three-stdlib/loaders/GLTFLoader"

import type {
  CylinderArgs,
  CylinderProps,
  PlaneProps,
} from "@react-three/cannon"

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
        <boxGeometry args={args} />
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

export function Mug() {
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
    //@ts -expect-error Investigate proper types here.
    e.target.setPointerCapture(e.pointerId)
    api.enable()
  }, [])
  const onPointerUp = React.useCallback(() => api.disable(), [])
  return { onPointerDown, onPointerUp }
}

interface ImageButtonProps {
  position: [number, number, number]
  rotation: [number, number, number]
  texture: THREE.Texture | THREE.Texture[]
  color?: string
  mass?: number
  scaleProp?: number
  onHoverScale?: number
  name?: string
  zoomToView?: Function
  zoomed?: boolean
  setIsHovered?: React.Dispatch<React.SetStateAction<boolean>>
}

export const ImageButton = ({
  position,
  rotation,
  texture,
  color,
  mass = 1,
  scaleProp = 1,
  onHoverScale = 1.5,
  name,
  zoomToView,
  zoomed = false,
  setIsHovered,
}: ImageButtonProps) => {
  const meshRef = useRef() as RefObject<
    Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>
  >

  const [hovered, setHover] = React.useState(false)

  const [ref, api] = useCylinder(
    () => ({
      args: [0.6, 0.6, 1, 15],
      mass: mass,
      position: [position[0], position[1], position[2]],
      rotation: [rotation[0], rotation[1], rotation[2]],
    }),
    useRef<THREE.Group>(null)
  )

  const bind = useDragConstraint(ref)

  const spring = useSpring({
    scale: hovered
      ? [
          scaleProp * onHoverScale,
          scaleProp * onHoverScale,
          scaleProp * onHoverScale,
        ]
      : [scaleProp, scaleProp, scaleProp],
  })

  const [textureIndex, setTextureIndex] = React.useState(0)
  const [textures, setTextures] = React.useState<THREE.Texture[]>()

  if (Array.isArray(texture)) {
    useEffect(() => {
      setTextures(texture)
      let i: number
      i = setInterval(() => {
        if (textures?.length) {
          setTextureIndex((textureIndex + 1) % textures.length)
        }
      }, 5000)

      return () => {
        if (i) {
          clearInterval(i)
        }
      }
    }, [textures, textureIndex])
  } else {
    useEffect(() => {
      setTextures([texture])
    }, [])
  }

  return (
    // @ts-ignore
    <a.group scale={spring.scale} ref={ref} {...bind} dispose={null}>
      <a.mesh
        name={name}
        ref={meshRef}
        onPointerOver={() => {
          if (!zoomed) {
            setHover(true)
            if (setIsHovered) {
              setIsHovered(true)
            }
          }
          document.body.style.cursor = "pointer"
        }}
        onPointerOut={() => (
          setHover(false),
          (document.body.style.cursor = ""),
          setIsHovered && setIsHovered(false)
        )}
        // @ts-ignore
        scale={spring.scale}
        onClick={(event) => {
          if (zoomToView && ref?.current) {
            zoomToView(ref.current.position)
          } else {
            api.applyImpulse(
              [
                genRandomBetween(-1, 1),
                genRandomBetween(-1, 4),
                genRandomBetween(-1, 3),
              ],
              [0, genRandomBetween(-3, 2), genRandomBetween(-4, 4)]
            )
          }
        }}
      >
        <boxGeometry args={[2, 2, 0.1]} />
        {textures && (
          <meshStandardMaterial
            map={textures[textureIndex]}
            color={color ?? ""}
          />
        )}
      </a.mesh>
    </a.group>
  )
}

export function Table() {
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

export function Chair() {
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

export function genRandomBetween(min, max) {
  return Math.random() * (max - min) + min
}

export function DummyBoy({ position, scale, elementControl }) {
  const { elementToControl, setElementToControl } = elementControl
  const dummy = useGLTF("/assets/characterAdrielFace.glb")
  // console.log(dummy)
  const [ref, api] = useBox(
    () => ({
      // args: [0, 0, 0],
      mass: 1,
      position: position,
      rotation: [0, 0, 0],
      type: "Dynamic",
    }),
    useRef<Group>(null)
  )
  const bind = useDragConstraint(ref)

  const [animationsIndex, setAnimationsIndex] = React.useState(0)
  // 0: AnimationClip {name: 'Idle }
  // 1: AnimationClip {name: 'Idle_swordLeft' }
  // 2: AnimationClip {name: 'Roll_sword' }
  // 3: AnimationClip {name: 'Run' }
  // 4: AnimationClip {name: 'Run_swordAttack' }
  // 5: AnimationClip {name: 'Run_swordRight' }

  let mixer
  if (dummy.animations.length) {
    mixer = new THREE.AnimationMixer(dummy.scene)
    const idleClipAnimation = dummy.animations[animationsIndex]
    const action = mixer.clipAction(idleClipAnimation)
    action.play()
  }

  const controls = useControls()

  // const velocity = React.useRef([0, 0, 0])

  // React.useEffect(() => {
  //   api.velocity.subscribe((v) => {
  //     velocity.current = v
  //     console.log(velocity.current, "v")
  //   })
  // }, [api.velocity])

  useFrame((state, delta) => {
    mixer?.update(delta)

    if (elementToControl === "boy") {
      const {
        backward,
        brake,
        forward,
        left,
        reset,
        right,
        cameraFollow,
        boost,
      } = controls.current

      if (forward || backward || left || right) {
        setAnimationsIndex(3)
        api.applyImpulse([0, 0.0001, 0], [0, 0.0001, 0])
        if (forward) {
          api.velocity.set(0, 0, -5)
          api.rotation.set(0, 3, 0)
        } else if (backward) {
          api.velocity.set(0, 0, 5)
          api.rotation.set(0, 0, 0)
        }

        if (left) {
          api.velocity.set(-5, 0, 0)
          api.rotation.set(0, -1.55, 0)
        } else if (right) {
          api.velocity.set(5, 0, 0)
          api.rotation.set(0, 1.5, 0)
        }
      } else {
        setAnimationsIndex(0)
        api.velocity.set(0, -5, 0)
      }
    }
  })

  return (
    <group
      ref={ref}
      {...bind}
      dispose={null}
      // onPointerDown={(e) => console.log("dummy boy", ref.current)}
      onClick={() => {
        api.applyImpulse(
          [0, 15, genRandomBetween(-.01, .01)],
          [0, 15, 0]
        )
        setElementToControl("boy")
      }}
    >
      <primitive object={dummy.scene} position={[0, -.45, 0]} scale={scale} />
    </group>
  )
}

export function Plane(props: PlaneProps) {
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

export function Pillar(props: CylinderProps) {
  const args: CylinderArgs = [0.7, 0.7, 5, 16]
  // const [rotation, setRotation] = React.useState(0)
  const [ref, api] = useCylinder(
    () => ({
      args,
      mass: 10,
      rotation: [0, 0, 0],
      ...props,
    }),
    useRef<Mesh>(null)
  )
  const texture = useLoader(THREE.TextureLoader, "/img/R3F.png")

  const y = genRandomBetween(-4, 4)
  useFrame(() => {
    api.angularVelocity.set(0, y, 0)
  })
  return (
    <mesh ref={ref} castShadow>
      <cylinderBufferGeometry args={args} />
      <meshNormalMaterial bumpMap={texture} />
    </mesh>
  )
}

function VideoButton({ position, rotation }) {
  const [hovered, setHover] = React.useState(false)

  const [ref] = useCylinder(
    () => ({
      args: [0.6, 0.6, 1, 15],
      mass: 0,
      position: [position[0], position[1], position[2]],
      rotation: [rotation[0], rotation[1], rotation[2]],
    }),
    useRef<Group>(null)
  )
  const bind = useDragConstraint(ref)

  const { scale } = useSpring({
    scale: !hovered ? [1.5, 1.5, 1.5] : [1, 1, 1],
  })

  const [videoIndex, setVideoIndex] = React.useState(0)

  const videoRef = useRef<HTMLVideoElement>(null)

  const videos = [
    "/videos/1.mp4",
    "/videos/2.mp4",
    "/videos/3.mp4",
    "/videos/4.mp4",
  ]
  const handleVideoEnd = () => {
    setVideoIndex((videoIndex + 1) % videos.length)
  }

  function VideoMaterial() {
    const texture = useVideoTexture("/videos/1.mp4", {})
    return <meshBasicMaterial map={texture} toneMapped={false} />
  }

  function FallbackMaterial() {
    const texture = useTexture("/img/R3F.png")
    return <meshBasicMaterial map={texture} toneMapped={false} />
  }

  const size = useAspect(1, 1)

  return (
    <>
      <group ref={ref} {...bind} dispose={null}>
        <mesh scale={5}>
          <planeGeometry />
          <Suspense fallback={<FallbackMaterial />}>
            <VideoMaterial />
          </Suspense>
        </mesh>
      </group>
    </>
  )
}

// const VideoPlaylist = ({ position, rotation }) => {
//   const [hovered, setHover] = React.useState(false)

//   const [ref] = useCylinder(
//     () => ({
//       args: [0.6, 0.6, 1, 15],
//       mass: 1,
//       position: [position[0], position[1], position[2]],
//       rotation: [rotation[0], rotation[1], rotation[2]],
//     }),
//     useRef<Group>(null)
//   )
//   const bind = useDragConstraint(ref)

//   const { scale } = useSpring({
//     scale: !hovered ? [1.5, 1.5, 1.5] : [1, 1, 1],
//   })

//   const videoRef = useRef<HTMLVideoElement | null>(null)

//   const [videoTexture, setVideoTexture] = React.useState<THREE.Texture | null>()

//   useEffect(() => {
//     debugger
//     if (videoRef?.current) {
//       setVideoTexture(useVideoTexture(videoRef))
//     }
//   }, [])

//   window.remotion_isPlayer = true
//   return (
//     <>
//       <Video
//         ref={videoRef}
//         src={"/videos/1.mp4"}
//         style={{ position: "absolute", opacity: 0 }}
//       />
//       {videoTexture ? (
//         <group ref={ref} {...bind} dispose={null}>
//           <mesh scale={2}>
//             <meshBasicMaterial map={videoTexture} />
//           </mesh>
//         </group>
//       ) : null}
//     </>
//   )
// }
