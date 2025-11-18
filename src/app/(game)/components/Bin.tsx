"use client";

import React from "react";

export function Bin({
  index,
  landed,
  children,
}: {
  index: number;
  landed?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={`w-10 h-14 flex items-end justify-center mx-1 relative ${
        landed ? "pulse" : ""
      }`}
      style={{
        perspective: 600,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "60%",
          background: "#111827",
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontSize: 10,
        }}
      >
        {children ?? index}
      </div>

      <style jsx>{`
        .pulse {
          animation: pulseBin 650ms ease forwards;
        }
        @keyframes pulseBin {
          0% { transform: translateY(0) scaleY(1); box-shadow: none; }
          30% { transform: translateY(-6px) scaleY(1.02); box-shadow: 0 8px 22px rgba(0,0,0,0.35); }
          100% { transform: translateY(0) scaleY(1); box-shadow: none; }
        }
      `}</style>
    </div>
  );
}
