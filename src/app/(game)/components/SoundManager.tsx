"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

export function useSoundManager() {
  const [muted, setMuted] = useState(false);
  const pegRef = useRef<HTMLAudioElement | null>(null);
  const winRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    pegRef.current = new Audio("/sounds/peg-tick.mp3"); // add file
    winRef.current = new Audio("/sounds/win-sfx.mp3"); // add file
    pegRef.current.volume = 0.25;
    winRef.current.volume = 0.6;
  }, []);

  const playPeg = useCallback(() => {
    if (muted) return;
    const el = pegRef.current;
    if (!el) return;
    // small clone so repeated hits can overlap
    const clone = el.cloneNode(true) as HTMLAudioElement;
    clone.play().catch(() => {});
  }, [muted]);

  const playWin = useCallback(() => {
    if (muted) return;
    winRef.current?.play().catch(() => {});
  }, [muted]);

  return { muted, setMuted, playPeg, playWin };
}

export function SoundToggle({ muted, setMuted }: { muted: boolean; setMuted: (v: boolean) => void }) {
  return (
    <button
      onClick={() => setMuted(!muted)}
      className="px-3 py-2 rounded-md bg-black/20 text-sm"
    >
      {muted ? "Unmute" : "Mute"}
    </button>
  );
}
