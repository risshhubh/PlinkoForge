"use client";

import React, { useEffect, useRef } from "react";
import Confetti from "react-confetti";
import Peg from "./Peg";

interface PlinkoBoardProps {
  rows: number;
  path: ("L" | "R")[];
  dropColumn: number;
  reducedMotion: boolean; // slow mode toggle
  golden: boolean;
  onComplete?: (finalBin: number) => void;
}

export const PlinkoBoard: React.FC<PlinkoBoardProps> = ({
  rows,
  path,
  dropColumn,
  reducedMotion,
  golden,
  onComplete,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
  const canvas = canvasRef.current;
  if (!canvas) return;

  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

  const width = canvas.width;
  const height = canvas.height;

  const pegSpacingX = width / (rows + 2);
  const pegSpacingY = height / (rows + 1);

  let pos = dropColumn;
  let row = 0;

  // BALL STATE
  let x = pegSpacingX * (Math.min(pos, row) + 1 + (rows - row) / 2);
  let y = 0;

  let vy = 0;
  const gravity = reducedMotion ? 0.2 : 0.6;

  // ----------------------------------------------------------
  // 🎯 DETERMINISTIC RANDOMNESS (SEED BASED ON PATH)
  // ----------------------------------------------------------
  const seed = path.join("").split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);

  function seededRandom(n: number) {
    let s = Math.sin(n + seed) * 10000;
    return s - Math.floor(s); // 0 → 1 deterministic
  }
  // ----------------------------------------------------------

  function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, golden ? 10 : 8, 0, Math.PI * 2);
    ctx.fillStyle = golden ? "gold" : "red";
    ctx.fill();
  }

  function step() {
    ctx.clearRect(0, 0, width, height);

    // Gravity
    vy += gravity;
    y += vy;

    const targetY = pegSpacingY * (row + 1);

    if (y >= targetY) {
      // Snap to peg-row
      y = targetY;

      // Apply deterministic micro-jitter
      const jitter = (seededRandom(row) - 0.5) * 12; // -6 to +6 px

      // Apply next turn direction
      if (path[row] === "R") pos++;

      row++;

      // Recalculate X target position
      let baseX = pegSpacingX * (Math.min(pos, row) + 1 + (rows - row) / 2);

      // Add jitter to X
      x = baseX + jitter;

      // Jitter also affects bounce velocity
      vy = (reducedMotion ? 0.4 : 1.1) + (seededRandom(row + 99) - 0.5) * 0.5;
    }

    drawBall();

    // End of board → stop
    if (row > rows) {
      onComplete?.(pos);
      return;
    }

    if (reducedMotion) {
      setTimeout(step, 16);
    } else {
      requestAnimationFrame(step);
    }
  }

  step();
}, [rows, path, dropColumn, reducedMotion, golden, onComplete]);





  return (
    <div style={{ position: "relative", width: 600, height: 400 }}>
      {/* PEGS (STATIC LAYER) */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          pointerEvents: "none",
        }}
      >
        {Array.from({ length: rows }).map((_, r) =>
          Array.from({ length: r + 1 }).map((_, c) => {
            const pegSpacingX = 600 / (rows + 2);
            const pegSpacingY = 400 / (rows + 1);
            const x = pegSpacingX * (c + 1 + (rows - r) / 2);
            const y = pegSpacingY * (r + 1);

            return <Peg key={`${r}-${c}`} x={x} y={y} />;
          })
        )}
      </div>

      {/* BALL CANVAS */}
      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 5,
        }}
      />

      {/* WIN EFFECT */}
      {golden && <Confetti recycle={false} numberOfPieces={100} />}
    </div>
  );
};
