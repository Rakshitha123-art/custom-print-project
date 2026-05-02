import React, { useEffect } from "react";

const Welcome = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();   // ✅ VERY IMPORTANT
    }, 2000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "black",
        color: "white",
        fontSize: "2rem",
        transition:"onFinish"
      }}
    >
      <h1 style={{ fontStyle: "italic", color: "white" }}>WEBSITE LOADING...</h1>
    </div>
  );
};

export default Welcome;