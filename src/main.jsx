import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { AppRoutes } from "./AppRoutes"

import "./index.css"

window.rootEl = document.getElementById("root")
window.rootEl.isDarkModeOn = true

ReactDOM.createRoot(window.rootEl).render(
  // <StrictMode></StrictMode>
  <React.Suspense fallback={null}>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </React.Suspense>
)
