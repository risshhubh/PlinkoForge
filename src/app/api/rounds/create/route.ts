import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST() {
  try {
    const serverSeed = crypto.randomBytes(32).toString("hex");

    const commitHex = crypto
      .createHash("sha256")
      .update(`${serverSeed}:${nonce}`)
      .digest("hex");

    // nonce can be anything unique – use random or timestamp
    const nonce = crypto.randomBytes(8).toString("hex");

    const round = await prisma.round.create({
      data: {
        status: "committed",
        nonce,               // REQUIRED
        serverSeed,          // stored privately
        commitHex,           // public hash
        combinedSeed: "",    // will fill later
        pegMapHash: "",      // will fill later
        rows: 12,
        dropColumn: 0,
        binIndex: 0,
        payoutMultiplier: 0,
        betCents: 0,
        pathJson: {},
      },
    });

    return NextResponse.json({
      success: true,
      roundId: round.id,
      commit: commitHex,
      nonce,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
