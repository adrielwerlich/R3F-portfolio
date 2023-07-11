import { Decal, Float, useTexture } from "@react-three/drei"
import { useState } from "react"

export default function Component(props) {
  const [decal] = useTexture([props.imgPath])
  const [hovered, setHovered] = useState(false)

  return (
    <Float speed={1} rotationIntensity={0.25} floatIntensity={0.5}>
      <mesh
        castShadow
        receiveShadow
        rotation={props.rotation}
        position={props.position}
        scale={props.scale}
      >
        <icosahedronGeometry args={props.geoArgs} />
        <meshStandardMaterial
          color={hovered ? "#2885f6" : props.color}
          polygonOffset
          polygonOffsetFactor={-5}
          flatShading
        />
        <Decal
          position={props.decalPosition}
          rotation={props.decalRotation}
          scale={props.decalScale}
          map={decal}
          // map-anisotropy={16}
          flatShading
        ></Decal>
      </mesh>
    </Float>
  )
}
