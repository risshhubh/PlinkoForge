// fairness.ts
import crypto from "crypto";

/**
 * computeCombinedSeed(serverSeed, clientSeed, nonce) => hex
 */
export function computeCombinedSeed(serverSeed: string, clientSeed: string, nonce: string) {
  return crypto.createHash("sha256").update(`${serverSeed}:${clientSeed}:${nonce}`).digest("hex");
}

/**
 * commit from serverSeed + nonce
 */
export function computeCommitHex(serverSeed: string, nonce: string) {
  return crypto.createHash("sha256").update(`${serverSeed}:${nonce}`).digest("hex");
}

/**
 * xorshift32 PRNG
 * seed: 32-bit integer
 */
export function xorshift32(seed: number) {
  let x = seed >>> 0;
  return function next() {
    // xorshift32
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    x = x >>> 0;
    return x / 0xffffffff;
  };
}
