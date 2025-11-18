// src/app/api/rounds/[id]/reveal/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params; // FIXED: params is a Promise

    if (!id) {
      return NextResponse.json({ error: "Missing roundId" }, { status: 400 });
    }

    const round = await prisma.round.findUnique({
      where: { id },
    });

    if (!round) {
      return NextResponse.json({ error: "Round not found" }, { status: 404 });
    }

    if (round.status !== "COMPLETED") {
      return NextResponse.json({ error: "Round not completed yet" }, { status: 400 });
    }

    // Hash serverSeed → serverSeedHash
    const revealedServerSeed = round.serverSeed ?? "";

const serverSeedHash = crypto
  .createHash("sha256")
  .update(revealedServerSeed)
  .digest("hex");

const path = round.pathJson ?? "[]";


    return NextResponse.json({
  roundId: round.id,
  serverSeed: revealedServerSeed,
  serverSeedHash,
  clientSeed: round.clientSeed,
  combinedSeed: round.combinedSeed,
  path: Array.isArray(round.pathJson) ? round.pathJson : [],
  binIndex: round.binIndex,
  payoutMultiplier: round.payoutMultiplier,
});


  } catch (err) {
    console.error("Reveal API error:", err);
    return NextResponse.json({ error: "Reveal failed", details: String(err) }, { status: 500 });
  }
}
