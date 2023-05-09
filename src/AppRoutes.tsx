import React from "react"

import {
  HashRouter as Router,
  Link,
  Route,
  Routes,
  useMatch,
  BrowserRouter,
} from "react-router-dom"

import CarEnvironmentLoader from "./Views/Car/CarEnvironmentLoader"

import LaptopView from "./Views/Laptop/LaptopView"

export const AppRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="" element={<LaptopView />} />
        <Route path="/car" element={<CarEnvironmentLoader />} />
      </Routes>
    </>
  )
}
