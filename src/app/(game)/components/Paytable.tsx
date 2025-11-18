"use client";

import React from "react";

const PAYTABLE = [
  10, 8, 6, 4, 2, 1.5, 1.2, 1.2, 1.5, 2, 4, 6, 8
]; // example symmetric multipliers for bins 0..12

export function Paytable({ bet = 1 }: { bet?: number }) {
  return (
    <div className="w-full max-w-md p-4 bg-white/6 rounded-2xl shadow-lg">
      <h3 className="text-sm font-semibold mb-2">Paytable</h3>
      <div className="grid grid-cols-7 gap-2">
        {PAYTABLE.map((m, i) => (
          <div key={i} className="flex flex-col items-center p-2 bg-black/10 rounded">
            <div className="text-xs opacity-80">Bin {i}</div>
            <div className="font-mono font-semibold">{m}×</div>
            <div className="text-[10px] opacity-70">{(m * bet).toFixed(2)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Paytable;
