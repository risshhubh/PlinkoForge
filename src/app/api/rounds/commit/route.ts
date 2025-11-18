import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Web Crypto SHA256 helper
async function sha256Hex(message: string) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function POST() {
  try {
    const serverSeed = crypto.randomUUID();
    const nonce = Math.floor(Math.random() * 1_000_000).toString();

    // Generate commit hash using Web Crypto
    const commitHex = await sha256Hex(`${serverSeed}:${nonce}`);

    // Save round in DB
   const round = await prisma.round.create({
  data: {
    serverSeed,
    nonce,
    commitHex,
    status: "CREATED",
    clientSeed: "",
    combinedSeed: "",
    pegMapHash: "",
    rows: 12,
    dropColumn: 6,
    binIndex: 0,
    payoutMultiplier: 1,
    betCents: 0,
    pathJson: [],
  },
});


    return NextResponse.json({ roundId: round.id, commitHex, nonce });
  } catch (err) {
    console.error(err);
    return NextResponse.error();
  }
}
