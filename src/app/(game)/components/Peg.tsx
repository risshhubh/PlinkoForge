"use client";

import React from "react";

interface PegProps {
  x: number;
  y: number;
  radius?: number;
  color?: string;
}

const Peg: React.FC<PegProps> = ({ x, y, radius = 5, color = "gray" }) => {
  return (
    <div
      style={{
        position: "absolute",
        left: x - radius,
        top: y - radius,
        width: radius * 2,
        height: radius * 2,
        borderRadius: "50%",
        backgroundColor: color,
        boxShadow: "0 0 6px rgba(0,0,0,0.3)",
      }}
    />
  );
};

export default Peg;
