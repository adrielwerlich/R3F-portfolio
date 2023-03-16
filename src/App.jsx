import { useState, useRef, useEffect } from "react"
import { animated, useSpring } from "@react-spring/three"

import "./App.css"
import { customPointerEvents } from "./helpers/customPointerEvents"

import EmptyLaptopScreen from "./ScreenAnimations/EmptyLaptopScreen"
import BuildLaptopScreen from "./ScreenAnimations/BuildScreen"
import OptimizeLaptopScreen from "./ScreenAnimations/OptimizeScreen"
import DesignLaptopScreen from "./ScreenAnimations/DesignScreen"

import { useControls } from "leva"

import {
  Physics,
  RigidBody,
  CuboidCollider,
  InstancedRigidBodies,
} from "@react-three/rapier"

import {
  useGLTF,
  Environment,
  Float,
  PresentationControls,
  ContactShadows,
  MeshReflectorMaterial,
  Html,
  Text,
} from "@react-three/drei"

import { useLaptopContext } from "./context/LaptopContext"
import { useStageLevelContext } from "./context/StageLevelContext"

import Buttons from "./Buttons"
import BuildExperience from "./Experiences/BuildExperience"
import OptimizeExperience from "./Experiences/OptimizeExperience"

function App(props) {
  const group = useRef()
  const laptopLight = useRef()

  const { nodes, materials } = useGLTF("./assets/notebookModel.gltf")

  const [isClosed, setIsClosed] = useLaptopContext()
  const [stageLevel, setStageLevel] = useStageLevelContext()
  const [lastLevel, setLastLevel] = useState(stageLevel)

  const spring = useSpring({
    rotation: isClosed ? [Math.PI, 0, 0] : [Math.PI / 2.75, 0, 0],
  })

  useEffect(() => {
    if (!isClosed && stageLevel === 0) {
      setStageLevel(1)
    }
  }, [isClosed])

  const handleClick = (e) => {
    e.stopPropagation()
    setIsClosed((prev) => !prev)
    setLastLevel(isClosed ? 0 : stageLevel)
    setStageLevel(isClosed ? lastLevel : 0)
  }

  // const computer = useGLTF("./assets/notebookModel.gltf")

  function ThreeObject(props) {
    const { nodes, materials } = useGLTF("/models/three-model.glb")

    // const leva = useControls({
    //   x: 5,
    //   y: -1.25,
    //   z: -0.25,
    //   rotationY: 6,
    //   rotationX: 9,
    //   rotationZ: 6,
    // })
    return (
      <group {...props} dispose={null}>
        <Text
          font="./bangers-v20-latin-regular.woff"
          fontSize={0.7}
          position={[5, -1.25, -0.25]}
          rotation={[9, 6, 6]}
          maxWidth={2}
          textAlign="left"
        >
          React Three Fiber
        </Text>
        <RigidBody type="fixed" colliders="trimesh" rotation={[-2, 4, -6]}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.boxBase.geometry}
            material={materials.boxBase}
          />
          <mesh
            receiveShadow
            geometry={nodes.boxBack.geometry}
            material={materials.inside}
          />
          {/* <mesh
            castShadow
            receiveShadow
            geometry={nodes.Text.geometry}
            material={materials.boxBase}
          /> */}
        </RigidBody>
      </group>
    )
  }

  return (
    <>
      <Environment preset="city" />

      <color args={["#0f59e2"]} attach="background" />
      <group position={[-0.3, -0.3, 0.6]} scale={0.6}>
        <PresentationControls
          global
          rotation={[0.1, -0.5, 0.05]}
          polar={[-0.4, 0.2]}
          azimuth={[-1, 0.75]}
          config={{ mass: 2, tension: 400 }}
          snap={{ mass: 4, tension: 400 }}
        >
          <Float rotationIntensity={0.4}>
            <BuildExperience />
            <OptimizeExperience />
            <Buttons />
            <group
              {...customPointerEvents}
              onClick={handleClick}
              ref={group}
              position={[0, -1.2, 0]}
              rotation={[0.122173, 0.296706, 0.03490659]}
              dispose={null}
            >
              <group position={[0, 0.52, 0]} scale={[0.1, 0.1, 0.1]}>
                <mesh
                  geometry={nodes.Circle001.geometry}
                  material={nodes.Circle001.material}
                />

                <mesh
                  geometry={nodes.Circle001_1.geometry}
                  material={nodes.Circle001_1.material}
                />

                <mesh
                  geometry={nodes.Circle001_2.geometry}
                  material={materials.HeadPhoneHole}
                />

                <mesh
                  geometry={nodes.Circle001_3.geometry}
                  material={nodes.Circle001_3.material}
                />

                <mesh
                  geometry={nodes.Circle001_4.geometry}
                  material={nodes.Circle001_4.material}
                />

                <mesh
                  geometry={nodes.Circle001_5.geometry}
                  material={materials.TouchbarBorder}
                />

                <mesh
                  geometry={nodes.Circle001_6.geometry}
                  material={materials.Keyboard}
                />
                <mesh
                  // @ts-ignore
                  geometry={nodes.KeyboardKeyHole.geometry}
                  // @ts-ignore
                  material={nodes.KeyboardKeyHole.material}
                  position={[-11.79, -0.15, -8.3]}
                  scale={5.8}
                />
                <mesh
                  // @ts-ignore
                  geometry={nodes.RubberFoot.geometry}
                  material={materials.DarkRubber}
                  position={[-11.95, -0.75, 7.86]}
                  scale={5.8}
                />
                <group position={[0.01, -0.21, -10.56]} scale={5.8}>
                  {/* @ts-ignore  */}
                  <mesh
                    geometry={nodes.Circle012.geometry}
                    material={materials.HingeBlack}
                  />
                  {/* @ts-ignore  */}
                  <mesh
                    geometry={nodes.Circle012_1.geometry}
                    material={materials.HingeMetal}
                  />
                </group>
                <group position={[0, -0.51, 0]} scale={5.8}>
                  {/* @ts-ignore  */}
                  <mesh
                    geometry={nodes.Circle006.geometry}
                    material={nodes.Circle006.material}
                  />
                  {/* @ts-ignore  */}
                  <mesh
                    geometry={nodes.Circle006_1.geometry}
                    material={nodes.Circle006_1.material}
                  />
                </group>
                <group position={[-11.79, -0.15, -8.3]} scale={5.8}>
                  {/* @ts-ignore  */}
                  <mesh
                    geometry={nodes.Circle.geometry}
                    material={nodes.Circle.material}
                  />
                  {/* @ts-ignore  */}
                  <mesh
                    geometry={nodes.Circle_1.geometry}
                    material={materials.Key}
                  />
                  {/* @ts-ignore  */}
                  <mesh
                    geometry={nodes.Circle_2.geometry}
                    material={materials.Touchbar}
                  />
                </group>
                {/* --Screen Hinge-- */}

                <animated.group
                  position={[0.01, -0.47, -10.41]}
                  rotation={spring.rotation}
                  scale={5.8}
                >
                  <mesh
                    // @ts-ignore
                    geometry={nodes.FrontCameraRing001.geometry}
                    material={materials["CameraRIngBlack.002"]}
                    position={[-0.15, 19.57, -16.15]}
                    scale={5.8}
                  />
                  <rectAreaLight
                    ref={laptopLight}
                    width={2.5}
                    height={1.65}
                    intensity={15}
                    color={"#7dc9ed"}
                    rotation={[-1.3, Math.PI, 0]}
                  />
                  <EmptyLaptopScreen
                    color={
                      isClosed
                        ? "black"
                        : stageLevel === 3
                        ? "#3c3a3a"
                        : "white"
                    }
                  />
                  <Html
                    scale={!isClosed && stageLevel === 1 ? 1 : 0}
                    transform
                    wrapperClass="htmlScreen"
                    distanceFactor={1.93}
                    position={[-0.03, 0, -1.84]}
                    rotation-x={-1.59}
                  >
                    <iframe src="https://adriel-portf.web.app" />
                  </Html>

                  <DesignLaptopScreen />
                  <BuildLaptopScreen />
                  <OptimizeLaptopScreen />

                  <group position={[-8.3, -0.3, 6.6]} scale={0.9}>
                    <Physics gravity={[0, -4, 0]}>
                      <ThreeObject position={[1, 0, -1.5]} />
                      <RigidBody
                        position={[0, -1, 0]}
                        type="fixed"
                        colliders="false"
                      >
                        <CuboidCollider
                          restitution={0.1}
                          args={[1000, 1, 1000]}
                        />
                      </RigidBody>
                    </Physics>
                  </group>

                  <mesh
                    geometry={nodes.Circle002.geometry}
                    material={nodes.Circle002.material}
                  />

                  <mesh
                    geometry={nodes.Circle002_1.geometry}
                    material={materials.Screen}
                  />

                  <mesh
                    geometry={nodes.Circle002_2.geometry}
                    material={materials.ScreenGlass}
                  />

                  <mesh
                    geometry={nodes.Circle002_3.geometry}
                    material={materials.Rubber}
                  />

                  <mesh
                    geometry={nodes.Circle002_4.geometry}
                    material={materials.DisplayGlass}
                  />
                </animated.group>

                <group position={[-15.03, 0.03, 0.6]} scale={5.8}>
                  <mesh
                    geometry={nodes.Circle009.geometry}
                    material={nodes.Circle009.material}
                  />

                  <mesh
                    geometry={nodes.Circle009_1.geometry}
                    material={nodes.Circle009_1.material}
                  />
                </group>
                <group position={[12.2, 0.03, 0.6]} scale={5.8}>
                  <mesh
                    geometry={nodes.Circle003.geometry}
                    material={nodes.Circle003.material}
                  />

                  <mesh
                    geometry={nodes.Circle003_1.geometry}
                    material={nodes.Circle003_1.material}
                  />
                </group>
              </group>
            </group>
            <Text
              font="./bangers-v20-latin-regular.woff"
              fontSize={0.7}
              position={[2, 0.75, 0.75]}
              rotation-y={-1.25}
              maxWidth={2}
              textAlign="left"
            >
              Adriel Werlich
            </Text>
          </Float>
        </PresentationControls>
      </group>
      {/* Reflection Plane */}
      <mesh
        scale={50}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -1.5, 0]}
        {...props}
      >
        <planeGeometry />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={2048}
          mixBlur={1}
          mixStrength={3}
          roughness={1}
          depthScale={1.2}
          minDepthThreshold={0.09}
          maxDepthThreshold={1.4}
          color="#181c2a"
          metalness={1}
          mirror={0}
        />
      </mesh>
      <ContactShadows position={-4} opacity={1.4} scale={20} blur={2} />
    </>
  )
}

export default App
