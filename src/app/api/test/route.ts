import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const rounds = await prisma.round.findMany(); 
  return NextResponse.json({ message: "API working!", rounds });
}
