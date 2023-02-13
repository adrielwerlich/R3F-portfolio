/*
R3F code Auto-generated by: https://github.com/pmndrs/gltfjsx
TS doesn't play well with the auto-generated files, so you'll notice plenty of '@ts-ignores'
*/

import React from "react"
import { useGLTF } from "@react-three/drei"

export default function Model(props) {
  const { nodes, materials } = useGLTF("/assets/plan_icon1.glb")
  return (
    <group {...props} dispose={null}>
      <group scale={0.09}>
        <group position={[0.15, 23, 0.1]}>
          <group position={[0.01, -8, -0.1]}>
            <group position={[-2.99, 0, 23.78]}>
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.Ellipse.geometry}
                material={materials["Deep Blue.001"]}
                position={[-21.74, -3.61, -0.06]}
                rotation={[-1.55, 0, -Math.PI / 2]}
                scale={[1, 1.06, 1]}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.Merged_Geometry.geometry}
                material={materials["Deep Blue.001"]}
                position={[-0.05, -2.41, -25.29]}
              />
            </group>
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Boolean.geometry}
              material={materials["Steel Blue"]}
              position={[28.79, -0.09, -28.71]}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Triangle.geometry}
              material={materials["Deep Blue.001"]}
              position={[5.63, -3.61, -27.32]}
              rotation={[-1.55, 0, -Math.PI / 2]}
            />
          </group>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Rectangle.geometry}
            material={materials.whiteish}
            position={[0.01, -22.47, -0.15]}
            rotation={[-1.56, 0, -1.57]}
          />
        </group>
      </group>
    </group>
  )
}

useGLTF.preload("/plan_icon1.glb")