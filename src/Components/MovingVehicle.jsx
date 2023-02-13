import { useGLTF } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useRef } from "react"
import * as THREE from "three"

export default function Model(props) {
  const { scene } = useGLTF("/assets/Lightning.gltf")
  const ref = useRef(null)

  useFrame((state) => {
    const angle = state.clock.elapsedTime * props.speed
    const up = new THREE.Vector3(-1, 0, 0)
    const direction = new THREE.Vector3(Math.sin(angle), 0, Math.cos(angle))
    const quaternion = new THREE.Quaternion().setFromUnitVectors(up, direction)
    ref.current.quaternion.copy(quaternion)
    ref.current.position.x = Math.sin(angle) * 5
    ref.current.position.z = Math.cos(angle) * 5
  })

  return (
    <group scale={0.6} position={[0, 0, 0]}>
      <primitive object={scene} ref={ref} {...props} />
    </group>
  )
}
