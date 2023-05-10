// This demo is also playable without installation here:
// https://codesandbox.io/s/basic-demo-forked-ebr0x

// import { useControls } from "leva"

import {
  ImageButton,
  DummyBoy,
  Chair,
  Table,
  Plane,
  Pillar,
} from "./ElementsInCarView"

import { useThree } from "@react-three/fiber"

import { Canvas, useFrame, useLoader } from "@react-three/fiber"

import * as THREE from "three"

import { Debug, Physics } from "@react-three/cannon"

import { animated } from "@react-spring/three"

import { Environment, Html, OrbitControls, Text } from "@react-three/drei"

import { Suspense, useEffect } from "react"
import React from "react"

import { useToggledControl } from "./use-toggled-control"
import Vehicle from "./Vehicle"

import CameraControls from "camera-controls"

import { useControls } from "./use-controls"

import Fallback from "../../Components/FallbackLoader"

CameraControls.install({ THREE })

const Carview = () => {
  const [isDarkModeOn, setIsDarkModeOn] = React.useState(true)
  const [showControls, setShowControls] = React.useState(true)

  const controls = useControls(setIsDarkModeOn, setShowControls)
  const [showScene, setShowScene] = React.useState(true)

  const [elementToControl, setElementToControl] = React.useState("boy")

  function CheckButtonPresses() {
    useFrame(() => {
      const { reset } = controls.current

      if (reset) {
        setShowScene(false)
        setTimeout(() => {
          setShowScene(true)
        }, 100)
      }
    })
    return <></>
  }

  const ToggledDebug = useToggledControl(Debug, ":")

  const reactTexture = useLoader(THREE.TextureLoader, "/img/R3F.png")

  const img1 = useLoader(THREE.TextureLoader, "/img/photos/cropped.jpeg")
  const img2 = useLoader(THREE.TextureLoader, "/img/photos/cropped2.jpeg")
  const img3 = useLoader(THREE.TextureLoader, "/img/photos/cropped3.jpeg")
  const img4 = useLoader(THREE.TextureLoader, "/img/photos/cropped4.jpeg")

  const [showOrbitControls, setShowOrbitControls] = React.useState(true)
  const [focus, setFocus] = React.useState({})
  const [zoom, setZoom] = React.useState(false)
  const [linkHovered, setLinkHovered] = React.useState(false)

  function CustomControls({
    zoom,
    focus,
    pos = new THREE.Vector3(),
    look = new THREE.Vector3(),
  }) {
    const camera = useThree((state) => state.camera)
    const gl = useThree((state) => state.gl)
    const controls = React.useMemo(
      () => new CameraControls(camera, gl.domElement),
      []
    )
    return useFrame((state, delta) => {
      zoom ? pos.set(focus.x, focus.y, focus.z + 3.8) : pos.set(0, 5, 10)
      zoom ? look.set(focus.x, focus.y, focus.z - 3.8) : look.set(0, 5, 4)

      state.camera.position.lerp(pos, 0.5)
      state.camera.updateProjectionMatrix()

      controls.setLookAt(
        state.camera.position.x,
        state.camera.position.y,
        state.camera.position.z,
        look.x,
        look.y,
        look.z,
        true
      )
      return controls.update(delta)
    })
  }

  const AnimatedText = animated(Text)

  // these are values for dark mode
  const [ambientLightIntensity, setAmbientLightIntensity] = React.useState(0.3)
  const [pointLightIntensity, setPointLightIntensity] = React.useState(0.5)
  const [backgroundColor, setBackgroundColor] = React.useState("darkblue")
  const [pointLightColor, setPointLightColor] = React.useState("gray")

  const [instructionTextColor, setInstructionTextColor] =
    React.useState<string>("white")

  useEffect(() => {
    if (isDarkModeOn) {
      setAmbientLightIntensity(0.3)
      setPointLightIntensity(0.5)
      setBackgroundColor("darkblue")
      setPointLightColor("gray")
      setInstructionTextColor("white")
    } else {
      setAmbientLightIntensity(0.5)
      setPointLightIntensity(0.8)
      setBackgroundColor("blue")
      setPointLightColor("white")
      setInstructionTextColor("yellow")
    }
  }, [isDarkModeOn])

  return (
    <>
      {showScene && (
        <Canvas
          shadows
          camera={{ fov: 100, position: [0, 5, 10], near: 0.1, far: 2000 }}
        >
          <CheckButtonPresses />
          <fog attach="fog" args={["blue", 10, 50]} />
          <color attach="background" args={[backgroundColor]} />
          <ambientLight intensity={ambientLightIntensity} />

          <pointLight
            intensity={pointLightIntensity}
            color={pointLightColor}
            position={[0, 0, 0]}
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
              <Plane
                rotation={[-Math.PI / 2, 0, 0]}
                userData={{ id: "floor" }}
              />
              <Vehicle
                position={[0, 2, 0]}
                rotation={[0, -Math.PI / 4, 0]}
                angularVelocity={[0, 0.7, 0]}
                elementControl={{
                  elementToControl,
                  setElementToControl,
                }}
              />
              <Pillar position={[-5, 2.5, -5]} userData={{ id: "pillar-1" }} />
              <Pillar position={[0, 2.5, -5]} userData={{ id: "pillar-2" }} />
              <Pillar position={[5, 2.5, -5]} userData={{ id: "pillar-3" }} />

              <Chair />
              <Table />
              <DummyBoy
                position={[3, 0, 4]}
                scale={0.5}
                elementControl={{
                  elementToControl,
                  setElementToControl,
                }}
              />

              <ImageButton
                position={[-11, 0.3, 0]}
                rotation={[-1.5, 0, 0]}
                texture={reactTexture}
                color={"#f0f"}
              />
              <group>
                <ImageButton
                  position={[-11, 6.9, -4]}
                  rotation={[0, 0, 0]}
                  mass={0}
                  texture={[img1, img2, img3, img4]}
                  color={""}
                  scaleProp={2}
                  onHoverScale={1.3}
                  name={"photos"}
                  setIsHovered={setLinkHovered}
                  zoomToView={(focusRef) => (
                    setZoom(!zoom),
                    setFocus(focusRef),
                    showOrbitControls
                      ? setShowOrbitControls(false)
                      : setTimeout(() => {
                          setShowOrbitControls(!showOrbitControls)
                        }, 1600)
                  )}
                  zoomed={zoom}
                />
                {/* @ts-ignore */}
                <AnimatedText
                  strokeOpacity={0}
                  fillOpacity={linkHovered ? 1 : 0}
                  font={"./fonts/woff/Averta-Standard-Black.woff"}
                  color={"white"}
                  fontSize={0.1}
                  characters="PlanDesignBuOtmz"
                  anchorX={"center"}
                  anchorY={"middle"}
                  scale={5}
                  position={[-1.5, 7.1, 0]}
                  rotation={[0.122173, 0.296706, 0.03490659]}
                >
                  Click to focus
                </AnimatedText>
              </group>
              {/* <VideoButton position={[-17, 4.3, 8]} rotation={[0, 0, 0]} /> */}
              {/* <VideoPlaylist position={[-17, 2.3, 2]} rotation={[-1.5, 0, 0]} /> */}
            </ToggledDebug>
          </Physics>
          <Environment preset="night" />
          {showOrbitControls ? (
            <OrbitControls />
          ) : (
            <CustomControls zoom={zoom} focus={focus} />
          )}
          {showControls && (
            <Html >
              <div
                style={{
                  color: instructionTextColor,
                  fontSize: "1.2em",
                  right: "23vw",
                  position: "absolute",
                  top: "-49vh",
                }}
              >
                <pre>
                  * arrows to drive, space to brake
                  <br />
                  <br />s to toggle instructions
                  <br />d to toogle dark mode
                  <br />r to reset
                  <br />? to debug
                  <br />
                  Shift to boost
                  <br />c to change camera view
                  <br />
                  click on the car or on the boy to control them
                  <br />
                  click on the photos to see cool zoom effect
                </pre>
              </div>
            </Html>
          )}
        </Canvas>
      )}
    </>
  )
}

export default Carview
