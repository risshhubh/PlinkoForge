import { NextResponse } from "next/server";
import { computeCommitHex, computeCombinedSeed } from "@/app/(game)/utils/fairness";
import { runPlinkoEngine } from "@/app/(game)/utils/engine";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const serverSeed = url.searchParams.get("serverSeed") ?? "";
    const clientSeed = url.searchParams.get("clientSeed") ?? "";
    const nonce = url.searchParams.get("nonce") ?? "";
    const dropColumn = parseInt(url.searchParams.get("dropColumn") ?? "6", 10);

    if (!serverSeed || !nonce || !clientSeed) {
      return NextResponse.json({ error: "serverSeed, clientSeed, nonce required" }, { status: 400 });
    }

    const commitHex = computeCommitHex(serverSeed, nonce);
    const combinedSeed = computeCombinedSeed(serverSeed, clientSeed, nonce);

    const { pegMapHash, binIndex } = runPlinkoEngine(combinedSeed, dropColumn, 12);

    return NextResponse.json({ commitHex, combinedSeed, pegMapHash, binIndex });
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message ?? err) }, { status: 500 });
  }
}
