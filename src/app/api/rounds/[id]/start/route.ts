import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { runPlinkoEngine } from "@/app/(game)/utils/engine";
import { computeCombinedSeed, sha256hex } from "@/app/(game)/utils/fairness";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: roundId } = await context.params;  // ✅ FIX

    if (!roundId) {
      return NextResponse.json({ error: "Missing roundId" }, { status: 400 });
    }

    const body = await req.json();
    const { clientSeed, dropColumn, betCents } = body;

    const round = await prisma.round.findUnique({ where: { id: roundId } });
    if (!round) {
      return NextResponse.json({ error: "Round not found" }, { status: 404 });
    }

    // Create deterministic combined seed
    const combinedSeed = computeCombinedSeed(round.serverSeed!, clientSeed, round.nonce);

    // Run the deterministic engine
    const result = runPlinkoEngine(combinedSeed, dropColumn, round.rows);

    // Extract path as array of "L" | "R"
    const path = result.path.map((decision) => decision.decision);

    await prisma.round.update({
      where: { id: roundId },
      data: {
        clientSeed,
        dropColumn,
        betCents,
        pathJson: path,
        binIndex: result.binIndex,
        combinedSeed,
        pegMapHash: result.pegMapHash,
        status: "STARTED",
      },
    });

    return NextResponse.json({ path, binIndex: result.binIndex, pegMapHash: result.pegMapHash });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
