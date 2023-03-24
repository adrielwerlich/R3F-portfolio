import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { AppRoutes } from "./AppRoutes"

import "./index.css"

ReactDOM.createRoot(document.getElementById("root")).render(
  // <StrictMode></StrictMode>
  <React.Suspense fallback={null}>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </React.Suspense>
)
