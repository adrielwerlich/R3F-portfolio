import { Text } from "@react-three/drei"
import { useState } from "react"
import DesignIcon from "./Icons/DesignIcon"
import PlanIcon from "./Icons/PlanIcon"
import BuildIcon from "./Icons/BuildIcon"
import OptimizeIcon from "./Icons/OptimizeIcon"
import { animated, useSpring } from "@react-spring/three"
import { useStageLevelContext } from "./context/StageLevelContext"
import { customPointerEvents } from "./helpers/customPointerEvents"
import { useLaptopContext } from "./context/LaptopContext"

// import { useControls } from "leva"

const BUTTON_WIDTH = 1.5
const BUTTON_MARGIN = 0.1

export default function Buttons(props) {
  // const levaControls = useControls({
  //   openX: -2.29,
  //   openX: 0.6,
  //   openX: 0.29,
  // })
  // Import Contexts
  const [stageLevel, setStageLevel] = useStageLevelContext()
  const [laptopClosed, setLaptopClosed] = useLaptopContext()

  // somethingHovered state variable as a prop to be passed to the button component so it can decide
  // whether or not it is the one being hovered for conditional label visibility
  const [somethingHovered, setSomethingHovered] = useState(false)

  const spring = useSpring({
    groupPosition: laptopClosed ? [-1.3, -0.5, -1] : [-2, 1.5, -1.75],
    groupRotation: laptopClosed ? [-0.25, 0.25, 0.1] : [0.1222, 0.2967, 0.0349],
  })

  const handlePlanButtonClick = (e) => {
    e.stopPropagation()
    setLaptopClosed(false)
    setStageLevel(1)
  }
  const handleDesignButtonClick = (e) => {
    e.stopPropagation()
    setLaptopClosed(false)
    setStageLevel(2)
  }
  const handleBuildButtonClick = (e) => {
    e.stopPropagation()
    setLaptopClosed(false)
    setStageLevel(3)
  }
  const handleOptimizeButtonClick = (e) => {
    e.stopPropagation()
    setLaptopClosed(false)
    setStageLevel(4)
  }

  return (
    <>
      <animated.group
        scale={0.4}
        position={spring.groupPosition}
        // @ts-ignore
        rotation={spring.groupRotation}
        onPointerOver={() => {
          setSomethingHovered(true)
        }}
        onPointerOut={() => {
          setSomethingHovered(false)
        }}
        {...props}
      >
        <mesh position={[2.25, 1, 0]}>
          <boxGeometry args={[6.5, 1.3, 2]} />
          <animated.meshStandardMaterial opacity={0} transparent />
        </mesh>
        <Button
          somethingHovered={somethingHovered}
          onClick={handlePlanButtonClick}
          type={"Plan"}
          position-x={0}
        ></Button>
        <Button
          somethingHovered={somethingHovered}
          onClick={handleDesignButtonClick}
          type={"Design"}
          position-x={BUTTON_WIDTH * 1 + BUTTON_MARGIN * 1}
        ></Button>
        <Button
          somethingHovered={somethingHovered}
          onClick={handleBuildButtonClick}
          type={"Build"}
          position-x={BUTTON_WIDTH * 2 + BUTTON_MARGIN * 2}
        />
        <Button
          somethingHovered={somethingHovered}
          onClick={handleOptimizeButtonClick}
          type={"Optimize"}
          position-x={BUTTON_WIDTH * 3 + BUTTON_MARGIN * 3}
        />
      </animated.group>
    </>
  )
}

function Button(props) {
  const [hovered, setHovered] = useState(false)
  const [stageLevel, setStageLevel] = useStageLevelContext()

  const isActive = () => {
    if (props.type === "Plan" && stageLevel === 1) {
      return true
    }
    if (props.type === "Design" && stageLevel === 2) {
      return true
    }
    if (props.type === "Build" && stageLevel === 3) {
      return true
    }
    if (props.type === "Optimize" && stageLevel === 4) {
      return true
    }
    return false
  }

  const isHovered = () => {
    if (hovered && props.somethingHovered) {
      return true
    }
    return false
  }

  const getLabelActivity = () => {
    return (
      // Check to see if something is hovered
      props.somethingHovered
        ? // Is that hovered thing this button?
          props.somethingHovered && hovered
          ? // Show if yes, hide if no
            1
          : 0
        : // If nothing is hovered, only show if is active
        isActive()
        ? 1
        : 0
    )
  }

  const spring = useSpring({
    scale: getLabelActivity() ? 0.13 : 0.09,
    position: hovered ? [-0.2, 1.1, 0.25] : [-0.2, 1.1, 0.1],
    constrictedScale: getLabelActivity() ? 0.11 : 0.09,
    constrictedPosition: hovered ? [0, 1.05, 0.15] : [0, 1.05, 0],
    color: isActive() ? "#2885f6" : "white",
    textSize: getLabelActivity(),
    config: { mass: 1.5, tension: 300 },
  })

  const AnimatedPlanIcon = animated(PlanIcon)
  const AnimatedDesignIcon = animated(DesignIcon)
  const AnimatedBuildIcon = animated(BuildIcon)
  const AnimatedOptimizeIcon = animated(OptimizeIcon)
  const AnimatedText = animated(Text)

  return (
    <group {...props}>
      <AnimatedText
        strokeOpacity={0}
        fillOpacity={getLabelActivity()}
        font={"./fonts/woff/Averta-Standard-Black.woff"}
        color={spring.color}
        fontSize={spring.textSize}
        characters="PlanDesignBuOtmz"
        anchorX={"center"}
        anchorY={"middle"}
        position={[-0.2, 2.5, 0]}
        rotation={[0.122173, 0.296706, 0.03490659]}
      >
        {props.type}
      </AnimatedText>
      {props.type === "Plan" && (
        // @ts-ignore
        <AnimatedPlanIcon
          scale={spring.scale}
          position={spring.position}
          rotation={[1.28, 0.21, -0.06]}
        />
      )}
      {props.type === "Design" && (
        // @ts-ignore
        <AnimatedDesignIcon
          scale={spring.scale}
          position={spring.position}
          rotation={[1.28, 0.21, -0.06]}
        />
      )}
      {props.type === "Build" && (
        <AnimatedBuildIcon
          scale={spring.constrictedScale}
          position={spring.constrictedPosition}
          rotation={[1.4, 0.21, 0.16]}
        />
      )}
      {props.type === "Optimize" && (
        // @ts-ignore
        <AnimatedOptimizeIcon
          scale={spring.scale}
          position={spring.position}
          rotation={[1.28, 0.21, -0.06]}
        />
      )}
      <mesh
        position={[-0.125, 1, 0]}
        {...customPointerEvents}
        onPointerOver={(e) => {
          e.stopPropagation()
          customPointerEvents.onPointerOver()
          setHovered(true)
        }}
        onPointerOut={(e) => {
          e.stopPropagation()
          customPointerEvents.onPointerOut()
          setHovered(false)
        }}
      >
        <boxGeometry args={[1.6, 1.25, 1.5]} />
        <meshStandardMaterial opacity={0} transparent />
      </mesh>
    </group>
  )
}
