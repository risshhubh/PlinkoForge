"use client";

import React, { useEffect, useRef, useState } from "react";

type BallProps = {
  path: ("L" | "R")[];
  pegPositions: { x: number; y: number }[][];
  dropColumn: number;
  reducedMotion?: boolean;
  golden?: boolean;
  onComplete?: (binIndex: number) => void;
};

export const Ball: React.FC<BallProps> = ({
  path,
  pegPositions,
  dropColumn,
  reducedMotion = false,
  golden = false,
  onComplete,
}) => {
  const [pos, setPos] = useState({
    x: 50 + dropColumn * 40 - 12 * 20,
    y: 20,
  });

  const stepRef = useRef(0);
  const animRef = useRef<number | null>(null);

  // Tunable physics
  const GRAVITY = reducedMotion ? 0.15 : 0.05; // slow gravity
  const SLOW_MOTION = 0.35; // slow multiplier
  const HORIZONTAL_FORCE = 2; // small sideways push for realism

  const velocity = useRef({ x: 0, y: 0 }); // physics velocity

  // Deterministic randomness based on path
  const seed = path.join("").split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  function seededRandom(n: number) {
    let s = Math.sin(n + seed) * 10000;
    return s - Math.floor(s); // 0 → 1 deterministic
  }

  const animate = () => {
    const step = stepRef.current;

    // If finished path → drop into bin smoothly
    if (step >= path.length) {
      velocity.current.y += GRAVITY;
      setPos((p) => ({
        x: p.x,
        y: p.y + velocity.current.y * SLOW_MOTION,
      }));

      if (pos.y > pegPositions[pegPositions.length - 1][0].y + 80) {
        const finalBin = Math.round(pos.x / 40);
        onComplete?.(finalBin);
        cancelAnimationFrame(animRef.current!);
      }

      animRef.current = requestAnimationFrame(animate);
      return;
    }

    // Ball "target" next peg row smoothly
    const row = step;
    const pegIndex = Math.min(row, pegPositions[row].length - 1);
    const peg = pegPositions[row][pegIndex];
    const dir = path[row] === "L" ? -1 : 1;

    const targetX = peg.x + dir * 20;
    const targetY = peg.y;

    // Physics approach movement
    velocity.current.y += GRAVITY;

    velocity.current.x +=
      ((targetX - pos.x) * 0.03) * SLOW_MOTION + dir * HORIZONTAL_FORCE * 0.02;

    setPos((p) => ({
      x: p.x + velocity.current.x * SLOW_MOTION,
      y: p.y + velocity.current.y * SLOW_MOTION,
    }));

    // When close to peg → advance to next step with organic bounce
    const dist = Math.hypot(pos.x - targetX, pos.y - targetY);
    if (dist < 5) {
      stepRef.current++;
      // Deterministic jitter for wiggle
      const jitterX = (seededRandom(step * 2) - 0.5) * 8; // -4 to +4 px
      setPos((p) => ({ ...p, x: p.x + jitterX }));
      // Deterministic bounce variation
      velocity.current.x = (seededRandom(step * 2 + 1) - 0.5) * 0.5; // small random x impulse
      velocity.current.y = (reducedMotion ? 0.4 : 1.1) + (seededRandom(step * 2 + 2) - 0.5) * 0.3; // bounce with variation
    }

    animRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current!);
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        width: 22,
        height: 22,
        borderRadius: "50%",
        backgroundColor: golden ? "gold" : "#ff4444",
        left: pos.x,
        top: pos.y,
        transition: "none",
        boxShadow: golden ? "0 0 12px gold" : "0 0 8px rgba(0,0,0,0.6)",
        border: golden ? "2px solid yellow" : "2px solid #b22222",
      }}
    />
  );
};
