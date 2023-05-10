import React from "react"

import { Html } from "@react-three/drei"

import "../assets/spinnerStyles.css"

const Fallback = ({ renderHtml = true }: { renderHtml: boolean }) => {
  console.log("fallback loading")

  const innerContent = (
    <div
      style={{
        padding: "10px",
        fontWeight: "900",
        fontSize: "3em",
        color: "white",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
        justifyContent: 'center',
      }}
    >
      Loading...
      <div className="lds-spinner">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  )

  return (
    <>
      {renderHtml ? (
        <Html>{innerContent}</Html>
      ) : (
        innerContent
      )}
    </>
  )
}

export default Fallback
