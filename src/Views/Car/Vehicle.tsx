import React from "react"
import * as THREE from "three"

import type { BoxProps, WheelInfoOptions } from "@react-three/cannon"
import { useBox, useRaycastVehicle } from "@react-three/cannon"
import { useFrame } from "@react-three/fiber"
import { useEffect, useRef } from "react"
import type { Group, Mesh } from "three"

import { Chassis } from "./Chassis"
import { useControls } from "./use-controls"
import { Wheel } from "./Wheel"
import { genRandomBetween } from "./ElementsInCarView"

export type VehicleProps = Required<
  Pick<BoxProps, "angularVelocity" | "position" | "rotation">
> & {
  back?: number
  force?: number
  front?: number
  height?: number
  maxBrake?: number
  radius?: number
  steer?: number
  width?: number
  elementControl: {
    elementToControl: string
    setElementToControl: React.Dispatch<React.SetStateAction<string>>
  }
}

function Vehicle({
  angularVelocity,
  back = -1.15,
  force = 1500,
  front = 1.3,
  height = -0.04,
  maxBrake = 50,
  position,
  radius = 0.7,
  rotation,
  steer = 0.5,
  width = 1.2,
  elementControl,
}: VehicleProps) {
  const wheels = [
    useRef<Group>(null),
    useRef<Group>(null),
    useRef<Group>(null),
    useRef<Group>(null),
  ]

  const { elementToControl, setElementToControl } = elementControl

  const [smoothedCameraPosition] = React.useState(
    () => new THREE.Vector3(10, 10, 10)
  )
  const [smoothedCameraTarget] = React.useState(() => new THREE.Vector3())

  const controls = useControls()

  const wheelInfo: WheelInfoOptions = {
    axleLocal: [-1, 0, 0], // This is inverted for asymmetrical wheel models (left v. right sided)
    customSlidingRotationalSpeed: -30,
    dampingCompression: 4.4,
    dampingRelaxation: 10,
    directionLocal: [0, -1, 0], // set to same as Physics Gravity
    frictionSlip: 2,
    maxSuspensionForce: 1e4,
    maxSuspensionTravel: 0.3,
    radius,
    suspensionRestLength: 0.3,
    suspensionStiffness: 30,
    useCustomSlidingRotationalSpeed: true,
  }

  const wheelInfo1: WheelInfoOptions = {
    ...wheelInfo,
    chassisConnectionPointLocal: [-width / 2, height, front],
    isFrontWheel: true,
  }
  const wheelInfo2: WheelInfoOptions = {
    ...wheelInfo,
    chassisConnectionPointLocal: [width / 2, height, front],
    isFrontWheel: true,
  }
  const wheelInfo3: WheelInfoOptions = {
    ...wheelInfo,
    chassisConnectionPointLocal: [-width / 2, height, back],
    isFrontWheel: false,
  }
  const wheelInfo4: WheelInfoOptions = {
    ...wheelInfo,
    chassisConnectionPointLocal: [width / 2, height, back],
    isFrontWheel: false,
  }

  const [chassiPosition, setChassiPosition] = React.useState([0, 0, 0])

  const [chassisBody, chassisApi] = useBox(
    () => ({
      allowSleep: false,
      angularVelocity,
      args: [1.7, 1, 4],
      mass: 500,
      onCollide: (e) => {}, // console.log("bonk", e.body.userData),
      position,
      rotation,
    }),
    useRef<Mesh>(null)
  )

  const [vehicle, vehicleApi] = useRaycastVehicle(
    () => ({
      chassisBody,
      wheelInfos: [wheelInfo1, wheelInfo2, wheelInfo3, wheelInfo4],
      wheels,
    }),
    useRef<Group>(null)
  )

  useFrame((state) => {
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

    if (elementToControl === "car") {
      for (let e = 2; e < 4; e++) {
        vehicleApi.applyEngineForce(
          forward || backward
            ? force * (forward && !backward ? (boost ? -4 : -2) : boost ? 10 : 2)
            : 0,
          2
        )
      }
  
      for (let s = 0; s < 2; s++) {
        vehicleApi.setSteeringValue(
          left || right
            ? steer * (left && !right ? (boost ? 2.2 : 1.6) : boost ? -2.2 : -1.6)
            : 0,
          s
        )
      }
  
      for (let b = 2; b < 4; b++) {
        vehicleApi.setBrake(brake ? maxBrake : 0, b)
      }
    } else {
      vehicleApi.setBrake(maxBrake, 2)
    }


    if (reset) {
      chassisApi.position.set(...position)
      chassisApi.velocity.set(0, 0, 0)
      chassisApi.angularVelocity.set(...angularVelocity)
      chassisApi.rotation.set(...rotation)
    }

    if (cameraFollow) {
      const pos = new THREE.Vector3(...chassiPosition)
      const cameraPosition = new THREE.Vector3()
      cameraPosition.copy(pos as THREE.Vector3)
      cameraPosition.z += 7.25
      cameraPosition.y += 2.65

      const cameraTarget = new THREE.Vector3()
      cameraTarget.copy(pos as THREE.Vector3)
      cameraTarget.y += 0.25

      smoothedCameraPosition.lerp(cameraPosition, 1)
      smoothedCameraTarget.lerp(cameraTarget, 1)

      state.camera.position.copy(smoothedCameraPosition)
      state.camera.lookAt(smoothedCameraTarget)
    }
  })

  useEffect(() => {
    chassisApi.position.subscribe((values) => {
      setChassiPosition(values)
    })
  }, [])

  return (
    <group
      ref={vehicle}
      position={[0, -0.4, 0]}
      onClick={() => {
        setElementToControl("car")
        chassisApi.applyImpulse(
          [0, 500, genRandomBetween(-.1, .1)],
          [0, 500, 0]
        )
      }}
    >
      <Chassis ref={chassisBody} />
      <Wheel ref={wheels[0]} radius={radius} leftSide />
      <Wheel ref={wheels[1]} radius={radius} />
      <Wheel ref={wheels[2]} radius={radius} leftSide />
      <Wheel ref={wheels[3]} radius={radius} />
    </group>
  )
}

export default Vehicle
