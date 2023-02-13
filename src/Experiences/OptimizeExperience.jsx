import { animated, useSpring } from '@react-spring/three'
import { Float } from '@react-three/drei'
import { useLaptopContext } from '../context/LaptopContext'
import { useStageLevelContext } from '../context/StageLevelContext'
import MovingVehicle from '../Components/MovingVehicle.jsx'
// import Target from './Target'
import { useEffect, useState } from 'react'

export default function OptimizeExperience(props) {
    const [isClosed, setIsClosed] = useLaptopContext()
    const [stageLevel, setStageLevel] = useStageLevelContext()
    const [speed, setSpeed] = useState(4)
  
    const isDisplayed = !isClosed && stageLevel === 4
  
    const spring = useSpring({
      scale: isDisplayed ? 1 : 0,
    })
  
    useEffect(() => setSpeed(2), [stageLevel])
  
    const handleTargetClick = (e) => {
      e.stopPropagation()
      setSpeed((prev) => prev + 1)
    }
  
    return (
      <animated.group scale={spring.scale}>
        <MovingVehicle speed={speed} />
        {/* <Float>
          <Target onClick={handleTargetClick} />
        </Float> */}
      </animated.group>
    )
  }
  