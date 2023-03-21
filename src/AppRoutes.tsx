import React from "react"

import {
  HashRouter as Router,
  Link,
  Route,
  Routes,
  useMatch,
  BrowserRouter,
} from "react-router-dom"

import Carview from "./Views/Car/CarView"

import LaptopView from "./Views/LaptopView"

export const AppRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="" element={<LaptopView />} />
        <Route path="/car" element={<Carview />} />
      </Routes>
    </>
  )
}
