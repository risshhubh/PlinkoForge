import { describe, it, expect } from "vitest";
import { runPlinkoEngine } from "../app/(game)/utils/engine";
import { computeCombinedSeed } from "../app/(game)/utils/fairness";

// Test vectors from spec
const serverSeed = "b2a5f3f32a4d9c6ee7a8c1d33456677890abcdeffedcba0987654321ffeeddcc";
const nonce = "42";
const clientSeed = "candidate-hello";
const dropColumn = 6;

describe("Plinko Engine", () => {
  it("should produce correct binIndex for test vectors", () => {
    const combinedSeed = computeCombinedSeed(serverSeed, clientSeed, nonce);
    const result = runPlinkoEngine(combinedSeed, dropColumn, 12);
    expect(result.binIndex).toBe(6); // Spec says binIndex = 6 for center drop
  });

  it("should be deterministic", () => {
    const combinedSeed = computeCombinedSeed(serverSeed, clientSeed, nonce);
    const result1 = runPlinkoEngine(combinedSeed, dropColumn, 12);
    const result2 = runPlinkoEngine(combinedSeed, dropColumn, 12);
    expect(result1.binIndex).toBe(result2.binIndex);
    expect(result1.pegMapHash).toBe(result2.pegMapHash);
    expect(JSON.stringify(result1.path)).toBe(JSON.stringify(result2.path));
  });
});
