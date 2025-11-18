"use client";

import React, { useState } from "react";
import { PlinkoBoard } from "./components/Board";
import { UIControls } from "./components/UIControls";
import { useSoundManager, SoundToggle } from "./components/SoundManager";

export default function GamePage() {
  const rows = 12;

  const [roundId, setRoundId] = useState<string | null>(null);
  const [path, setPath] = useState<("L" | "R")[]>([]);
  const [dropColumn, setDropColumn] = useState(6);
  const [binIndex, setBinIndex] = useState<number | null>(null);
  const [golden, setGolden] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [roundsPlayed, setRoundsPlayed] = useState(0);

  // Use SoundManager hook
  const { muted, setMuted, playPeg, playWin } = useSoundManager();

  const handleStart = async () => {
    try {
      setGolden(false);

      const commitRes = await fetch("/api/rounds/commit", { method: "POST" });
      const commitData = await commitRes.json();
      const newRoundId = commitData.roundId;
      setRoundId(newRoundId);

      const startRes = await fetch(`/api/rounds/${newRoundId}/start`, {
        method: "POST",
        body: JSON.stringify({
          clientSeed: "player-xyz",
          dropColumn,
          betCents: 100,
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (!startRes.ok) {
        const text = await startRes.text();
        console.error("Start API error:", text);
        return;
      }

      const data = await startRes.json();
      setPath(data.path ?? []);
      setBinIndex(data.binIndex ?? 0);
      setRoundsPlayed(prev => prev + 1);

      // Play peg sound for each step
      data.path?.forEach(() => playPeg());
    } catch (err) {
      console.error("Error starting round:", err);
    }
  };

  const handleReveal = async () => {
    if (!roundId) return;
    try {
      const revealRes = await fetch(`/api/rounds/${roundId}/reveal`, { method: "POST" });
      const data = await revealRes.json();
      alert(`ServerSeed: ${data.serverSeed}`);
    } catch (err) {
      console.error("Reveal error:", err);
    }
  };

  const handleComplete = (finalBin: number) => {
    console.log("Ball landed in bin:", finalBin);
    // Trigger golden ball and confetti if landed in center bin after 2-3 rounds
    if (finalBin === 6 && roundsPlayed >= 2) {
      setGolden(true);
      playWin(); // Correct function from useSoundManager
    }
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center p-6"
      style={{ background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)" }}
    >
      <div className="w-full max-w-3xl rounded-3xl shadow-2xl p-8 backdrop-blur-lg" style={{ background: "rgba(255, 255, 255, 0.1)", border: "1px solid rgba(255, 255, 255, 0.2)" }}>
        <h1 className="text-center text-3xl font-bold mb-6 text-white drop-shadow">
          🎯 Plinko Forge
        </h1>

        {/* Sound toggle */}
        <div className="flex justify-end mb-4">
          <SoundToggle muted={muted} setMuted={setMuted} />
        </div>

        <div className="flex justify-center mb-6">
          <UIControls
            dropColumn={dropColumn}
            setDropColumn={setDropColumn}
            startRound={handleStart}
            revealRound={handleReveal}
            reducedMotion={reducedMotion}
            setReducedMotion={setReducedMotion}
          />
        </div>

        <div className="flex justify-center">
          {path.length > 0 ? (
            <div className="rounded-2xl p-6 shadow-xl" style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)" }}>
              <PlinkoBoard
                rows={rows}
                path={path}
                dropColumn={dropColumn}
                reducedMotion={reducedMotion}
                golden={golden}
                onComplete={handleComplete}
              />
            </div>
          ) : (
            <p className="text-white opacity-70 text-center">
              Press <strong>Start Round</strong> to begin
            </p>
          )}
        </div>

        {binIndex !== null && (
          <p className="text-center mt-6 text-lg font-semibold text-green-300">
            ⭐ Ball landed in bin: {binIndex}
          </p>
        )}
      </div>
    </div>
  );
}
