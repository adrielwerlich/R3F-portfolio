import React from "react"
import * as THREE from "three"

const smoothedCameraPosition = new THREE.Vector3(10, 10, 10)
const smoothedCameraTarget = new THREE.Vector3()

export function cameraShouldFollow(position, state) {
  const pos = new THREE.Vector3(...position)
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
