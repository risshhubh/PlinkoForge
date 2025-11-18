import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

function generateCombinedSeed(serverSeed: string, clientSeed: string) {
  return crypto
    .createHash("sha256")
    .update(serverSeed + ":" + clientSeed)
    .digest("hex");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { roundId, clientSeed, pathJson, binIndex, payoutMultiplier } = body;

    const round = await prisma.round.findUnique({ where: { id: roundId } });
    if (!round) return NextResponse.json({ error: "Round not found" }, { status: 404 });

    const combinedSeed = generateCombinedSeed(round.serverSeed!, clientSeed);

    const updated = await prisma.round.update({
      where: { id: roundId },
      data: {
        status: "revealed",
        clientSeed,
        combinedSeed,
        pathJson,
        binIndex,
        payoutMultiplier,
        revealedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, round: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
