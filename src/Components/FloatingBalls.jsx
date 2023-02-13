import { Euler } from "three"
import DecalBall from "./DecalBall"
import { animated, useSpring } from "@react-spring/three"
import { useLaptopContext } from "../context/LaptopContext"
import { useStageLevelContext } from "../context/StageLevelContext"

// import { useControls } from "leva"

export default function FloatingBalls(props) {
  // const levaControls = useControls({
  //   aa: -3.58, // firebase -0.05,
  //   bb: -4.4, // firebase -4.91,
  //   cc: -0.35, // firebase -3.96,
  //   x: 2, // firebase 1.25,
  //   y: 0.75, // firebase -1.25,
  //   z: 0.65, // firebase 0,
  //   rotation: 0,
  //   a: 0.4,
  //   b: 1,
  //   decalPositionX: 0.29,
  //   decalPositionY: 0.06,
  //   decalPositionZ: 0.12,
  // })

  const rotations = {
    typescript: new Euler(-5.3, 2.16, -0.66),
    vercel: new Euler(-0.97, 0.03, 0.16),
    react: new Euler(-2.73, -1.19, 0),
    reactNative: new Euler(-3.58, -4, -.05),
    next: new Euler(-0.05, -4.91, -3.96),
    vue: new Euler(-0.1, -0.98, -0.14),
    // firebase: new Euler(levaControls.aa, levaControls.bb, levaControls.cc),
  }
  const [isClosed, setIsClosed] = useLaptopContext()
  const [stageLevel, setStageLevel] = useStageLevelContext()

  const AnimatedDecalBall = animated(DecalBall)
  const displayBalls = !isClosed && stageLevel === 3

  const spring = useSpring({
    typescriptPosition: displayBalls ? [-2.29, 1.6, 0.29] : [0, 0, 0],
    vercelPosition: displayBalls ? [-0.69, 1.75, -3.5] : [0, 0, 0],
    reactPosition: displayBalls ? [1.25, 1.25, 0.5] : [0, 0, 0],
    reactNativePosition: displayBalls
      ? [3, .75, .65]
      : [0, 0, 0],
    nextPosition: displayBalls ? [3, 1.75, 0] : [0, 0, 0],
    vuePosition: displayBalls ? [-2.54, -0.2, -0.1] : [0, 0, 0],
    firebasePosition: displayBalls ? [3.7, 0.25, 2] : [0, 0, 0],
    decalScale: displayBalls ? 0.5 : 0,
    decalScaleLarge: displayBalls ? 0.75 : 0,
  })

  const scale = 1

  return (
    <>
      {/* Typescript */}
      <AnimatedDecalBall
        scale={scale}
        imgPath={"./img/typescript.webp"}
        position={spring.typescriptPosition}
        rotation={rotations.typescript}
        geoArgs={[0.4, 1]}
        color={"#92c1fa"}
        decalPosition={[-0.34, 0.1, 0.04]}
        decalScale={spring.decalScale}
        decalRotation={0}
        id="typescript-ball"
      />
      {/* Firebase */}
      {/* <AnimatedDecalBall
        scale={scale}
        imgPath={"./img/logo-vue.webp"}
        position={spring.firebasePosition}
        rotation={rotations.firebase}
        geoArgs={[0.5, 1]}
        color={"#e1d0b3"}
        decalPosition={[
          levaControls.decalPositionX,
          levaControls.decalPositionY,
          levaControls.decalPositionZ,
        ]}
        decalScale={.6}
        decalRotation={levaControls.rotation}
        id="firebase-ball"
      /> */}
      {/* Vue */}
      <AnimatedDecalBall
        scale={scale}
        imgPath={"./img/logo-vue.webp"}
        position={spring.vuePosition}
        rotation={rotations.vue}
        geoArgs={[0.55, 1]}
        color={"#317873"}
        decalPosition={[0.5, 0.1, 0.05]}
        decalRotation={-0.4}
        decalScale={spring.decalScale}
        id="vue-ball"
      />
      {/* Vercel */}
      <AnimatedDecalBall
        scale={scale}
        imgPath={"./img/vercel.webp"}
        position={spring.vercelPosition}
        rotation={rotations.vercel}
        geoArgs={[0.5, 1]}
        color={"#74808f"}
        decalPosition={[0.04, -0.33, 0.39]}
        decalScale={spring.decalScale}
        decalRotation={-6.33}
      />
      {/* React */}
      <AnimatedDecalBall
        scale={scale}
        imgPath={"./img/react.png"}
        position={spring.reactPosition}
        rotation={rotations.react}
        geoArgs={[0.55, 1]}
        color={"#92c1fa"}
        decalPosition={[-0.43, -0.42, -0.22]}
        decalScale={spring.decalScaleLarge}
        decalRotation={0}
      />
      {/* React Native */}
      <AnimatedDecalBall
        scale={scale}
        imgPath={"./img/react-native.webp"}
        position={spring.reactNativePosition}
        rotation={rotations.reactNative}
        geoArgs={[0.35, 1]}
        color={"#245a9d"}
        decalPosition={[0.29, 0.06, 0.12]}
        decalScale={spring.decalScale}
        decalRotation={-3.2}
      />
      {/* Next.JS */}
      <AnimatedDecalBall
        scale={scale}
        imgPath={"./img/next.webp"}
        position={spring.nextPosition}
        rotation={rotations.next}
        geoArgs={[0.35, 1]}
        color={"#b9cee8"}
        decalPosition={[0.2, 0.1, -0.02]}
        decalScale={spring.decalScale}
        decalRotation={-Math.PI}
      />
    </>
  )
}
