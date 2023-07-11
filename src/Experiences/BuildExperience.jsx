import { animated, useSpring } from "@react-spring/three"
import { useLaptopContext } from "../context/LaptopContext"
import { useStageLevelContext } from "../context/StageLevelContext"
import FloatingBalls from "../Components/FloatingBalls"

export default function BuildExperience(props) {
  const [isClosed, setIsClosed] = useLaptopContext()
  const [stageLevel, setStageLevel] = useStageLevelContext()

  const isDisplayed = !isClosed && stageLevel === 3

  const spring = useSpring({
    scale: isDisplayed ? 1 : 0,
  })

  return (
    <animated.group scale={spring.scale}>
      <FloatingBalls />
    </animated.group>
  )
}
