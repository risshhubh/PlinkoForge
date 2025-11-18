"use client";

export function UIControls({
  dropColumn,
  setDropColumn,
  startRound,
  revealRound,
  reducedMotion,
  setReducedMotion,
}: any) {
  return (
    <div className="flex flex-col gap-6 items-center">
      <div className="text-lg font-semibold tracking-wide">
        Drop Column: <span className="text-cyan-300">{dropColumn}</span>
      </div>

      <input
        type="range"
        min="0"
        max="12"
        value={dropColumn}
        onChange={(e) => setDropColumn(parseInt(e.target.value))}
        className="w-72 accent-cyan-400"
      />

      <div className="flex gap-6 mt-4">
        <button
          onClick={startRound}
          className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400
                     font-bold shadow-[0_0_20px_#00ffff55] active:scale-95
                     transition-all duration-200"
        >
          PLAY ROUND
        </button>

        <button
          onClick={revealRound}
          className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 
                     font-bold shadow-[0_0_20px_#b57aff55] active:scale-95 
                     transition-all duration-200"
        >
          REVEAL SEED
        </button>
      </div>

      <label className="flex items-center gap-2 opacity-70 mt-2">
        <input
          type="checkbox"
          checked={reducedMotion}
          onChange={(e) => setReducedMotion(e.target.checked)}
        />
        Reduce Motion
      </label>
    </div>
  );
}
