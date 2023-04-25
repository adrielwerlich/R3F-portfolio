import type { MutableRefObject } from "react"
import { useEffect, useRef } from "react"

function useKeyControls(
  { current }: MutableRefObject<Record<GameControl, boolean>>,
  map: Record<KeyCode, GameControl>,
  setIsDarkModeOn: (isDarkModeOn: boolean) => void
) {
  useEffect(() => {
    const handleKeydown = ({ key }: KeyboardEvent) => {
      if (!isKeyCode(key)) return
      if (key === "d") {
        if (setIsDarkModeOn) {
          if (window.rootEl.isDarkModeOn) {
            window.rootEl.isDarkModeOn = false
            window.rootEl.style.background = "white"
            setIsDarkModeOn(false)
          } else {
            window.rootEl.isDarkModeOn = true
            window.rootEl.style.background = "black"
            setIsDarkModeOn(true)
          }
        }
      }
      if (key === "c" && current[map[key]]) {
        current[map[key]] = false
      } else {
        current[map[key]] = true
      }
    }
    window.addEventListener("keydown", handleKeydown)
    const handleKeyup = ({ key }: KeyboardEvent) => {
      if (!isKeyCode(key) || (key === "c" && current[map[key]])) return

      current[map[key]] = false
    }
    window.addEventListener("keyup", handleKeyup)
    return () => {
      window.removeEventListener("keydown", handleKeydown)
      window.removeEventListener("keyup", handleKeyup)
    }
  }, [current, map])
}

const keyControlMap = {
  " ": "brake",
  ArrowDown: "backward",
  ArrowLeft: "left",
  ArrowRight: "right",
  ArrowUp: "forward",
  Shift: "boost",
  d: "darkModeToggle",
  r: "reset",
  c: "cameraFollow",
} as const

type KeyCode = keyof typeof keyControlMap
type GameControl = typeof keyControlMap[KeyCode]

const keyCodes = Object.keys(keyControlMap) as KeyCode[]
const isKeyCode = (v: unknown): v is KeyCode => keyCodes.includes(v as KeyCode)

export function useControls(setIsDarkModeOn) {
  const controls = useRef<Record<GameControl, boolean>>({
    backward: false,
    brake: false,
    forward: false,
    left: false,
    reset: false,
    right: false,
    cameraFollow: false,
    boost: false,
    darkModeToggle: false,
  })

  useKeyControls(controls, keyControlMap, setIsDarkModeOn)

  return controls
}
