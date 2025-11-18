"use client";

import React, { useState } from "react";

export default function VerifyPage() {
  const [serverSeed, setServerSeed] = useState("");
  const [clientSeed, setClientSeed] = useState("");
  const [nonce, setNonce] = useState("");
  const [dropColumn, setDropColumn] = useState(6);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const qs = new URLSearchParams({
      serverSeed,
      clientSeed,
      nonce,
      dropColumn: String(dropColumn),
    }).toString();

    const res = await fetch(`/api/verify?${qs}`);
    const body = await res.json();
    setResult(body);
    setLoading(false);
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Verifier</h2>

      <form onSubmit={handleVerify} className="space-y-3">
        <label className="block">
          <div className="text-xs text-slate-400">Server Seed</div>
          <input value={serverSeed} onChange={(e) => setServerSeed(e.target.value)} className="input" />
        </label>

        <label className="block">
          <div className="text-xs text-slate-400">Client Seed</div>
          <input value={clientSeed} onChange={(e) => setClientSeed(e.target.value)} className="input" />
        </label>

        <label className="block">
          <div className="text-xs text-slate-400">Nonce</div>
          <input value={nonce} onChange={(e) => setNonce(e.target.value)} className="input" />
        </label>

        <label className="block">
          <div className="text-xs text-slate-400">Drop Column</div>
          <input type="number" min={0} max={12} value={dropColumn} onChange={(e) => setDropColumn(Number(e.target.value))} className="input" />
        </label>

        <button disabled={loading} className="px-4 py-2 bg-cyan-500 rounded">
          {loading ? "Verifying..." : "Verify"}
        </button>
      </form>

      {result && (
        <div className="mt-6 space-y-2 p-4 bg-white/5 rounded">
          <div><strong>commitHex:</strong> {result.commitHex}</div>
          <div><strong>combinedSeed:</strong> {result.combinedSeed}</div>
          <div><strong>pegMapHash:</strong> {result.pegMapHash}</div>
          <div><strong>binIndex:</strong> {result.binIndex}</div>
        </div>
      )}
    </div>
  );
}
