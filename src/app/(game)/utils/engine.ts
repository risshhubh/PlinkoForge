// engine.ts
import crypto from "crypto";
import { xorshift32 } from "./fairness";

export type Peg = { leftBias: number };
export type PegMap = Peg[][];

export function seedToUint32(seedHex: string) {
  // take first 4 bytes as big-endian
  const buf = Buffer.from(seedHex, "hex");
  return buf.readUInt32BE(0);
}

/**
 * Generate peg map and path deterministically.
 * Returns { pegMap, pegMapHash, path, binIndex }
 */
export function runPlinkoEngine(combinedSeedHex: string, dropColumn: number, rows = 12) {
  const seed = seedToUint32(combinedSeedHex);
  const rand = xorshift32(seed);

  // generate pegMap
  const pegMap: PegMap = [];
  for (let r = 0; r < rows; r++) {
    const rowArr: Peg[] = [];
    for (let c = 0; c <= r; c++) {
      // leftBias in [0.4, 0.6] using rand()
      const rv = rand(); // 0..1
      const leftBias = Number((0.5 + (rv - 0.5) * 0.2).toFixed(6));
      rowArr.push({ leftBias });
    }
    pegMap.push(rowArr);
  }

  const pegMapHash = crypto.createHash("sha256").update(JSON.stringify(pegMap)).digest("hex");

  // path decision using same PRNG stream order (rand continues)
  let pos = dropColumn;
  const path: ("L" | "R")[] = [];

  for (let r = 0; r < rows; r++) {
    const pegIndex = Math.min(pos, r);
    const peg = pegMap[r][pegIndex];
    // adj
    const adj = (dropColumn - Math.floor(rows / 2)) * 0.01;
    const biasPrime = Math.min(1, Math.max(0, peg.leftBias + adj));

    const rnd = rand();
    if (rnd < biasPrime) {
      path.push("L");
    } else {
      path.push("R");
      pos += 1;
    }
  }

  const binIndex = pos;

  return { pegMap, pegMapHash, path, binIndex };
}
