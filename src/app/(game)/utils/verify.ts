import crypto from "crypto";
import { computeCombinedSeed } from "./fairness";
import { runPlinkoEngine } from "./engine";

export function sha256(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

// The main verification function
export function verifyFairness(data: {
  serverSeed: string;
  clientSeed: string;
  nonce: string;
  commitHex: string;
  rows: number;
  dropColumn: number;
  pegMapHash: string;
  binIndex: number;
  pathJson: any;
}) {
  const {
    serverSeed,
    clientSeed,
    nonce,
    commitHex,
    rows,
    dropColumn,
    pegMapHash,
    binIndex,
    pathJson,
  } = data;

  // 1. Check commit hash
  const computedCommit = sha256(`${serverSeed}:${nonce}`);
  const commitMatches = computedCommit === commitHex;

  // 2. Compute combined seed
  const combinedSeed = computeCombinedSeed(serverSeed, clientSeed, nonce);

  // 3. Re-run the plinko engine
  const result = runPlinkoEngine(combinedSeed, dropColumn, rows);

  const pegMapMatches = result.pegMapHash === pegMapHash;
  const binMatches = result.binIndex === binIndex;
  const pathMatches =
    JSON.stringify(result.path) === JSON.stringify(pathJson);

  const isFair =
    commitMatches && pegMapMatches && binMatches && pathMatches;

  return {
    isFair,
    commitMatches,
    pegMapMatches,
    binMatches,
    pathMatches,
    combinedSeed,
    engineResult: result,
  };
}
