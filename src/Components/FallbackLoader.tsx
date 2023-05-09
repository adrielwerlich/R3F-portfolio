import React from "react"

import { Html } from "@react-three/drei"

import "../assets/spinnerStyles.css"

const Fallback = () => {
    console.log("fallback loading")
  
    return (
      <>
        <Html position={[-0.03, 0, -1.84]}>
          <div
            style={{
              padding: "10px",
              fontWeight: "900",
              fontSize: "3em",
              color: "white",
              width: "200px",
              height: "200px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "20px",
            }}
          >
            Loading...
            <div className="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
            {/* <span style={{ color: "blue" }}>text</span> */}
          </div>
        </Html>
      </>
    )
  }

  export default Fallback;