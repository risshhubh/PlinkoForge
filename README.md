Plinko Lab – Provably Fair

Interactive Plinko Game with Commit-Reveal RNG, Deterministic Engine, Verifier, API + DB
Tech Stack: Next.js 14 (App Router) • TypeScript • PostgreSQL (Prisma) • Canvas • Mulberry32 PRNG • SHA-256

⭐ Live Demo

🔗 App URL: <your vercel url>
🔗 Verifier Page: <your vercel url>/verify
🔗 Example Round: <your vercel url>/round/<id>

📦 Repository

GitHub: <your repo link>

📘 Overview

This project implements a provably-fair Plinko game following the full specification provided by Daphnis Labs. The system includes:

🎮 Interactive Plinko gameplay

🔐 Cryptographically provable fairness (SHA-256 commit-reveal)

🎲 Deterministic, seed-replayable simulation engine

📡 Full backend: Prisma + Next.js API routes

📊 Verifier page to independently recompute & validate results

🎨 Smooth animations, sound effects, accessibility features

🧪 Unit tests for PRNG, fairness combiner, engine path

All randomness and peg decisions are fully reproducible from seeds, ensuring fairness.

🏛️ Architecture Overview
/app
  /api
    /rounds
      commit/route.ts
      [id]/
        start/route.ts
        reveal/route.ts
    verify/route.ts
  /verify/page.tsx

/prisma
  schema.prisma

/lib
  prng.ts
  fairness.ts
  engine.ts
  hash.ts

/components
  PlinkoBoard.tsx
  VerifierForm.tsx

🔹 Flow

Client starts a round →

Server creates serverSeed, nonce, stores commitHex

Client sends clientSeed, bet, dropColumn

Server computes:

combinedSeed = SHA256(serverSeed:clientSeed:nonce)

Deterministic PRNG

Peg map

Path

Final bin

Server returns outcome (but not serverSeed)

After result → server reveals serverSeed

User can verify everything on /verify.

🔐 Provably-Fair Protocol (implemented)
Commit Phase
commitHex = SHA256(serverSeed + ":" + nonce)

Reveal Phase

After ball lands:

Server reveals serverSeed

Verifier recomputes commit

Combined Seed
combinedSeed = SHA256(serverSeed + ":" + clientSeed + ":" + nonce)

PRNG

Using mulberry32 seeded by first 4 bytes of combinedSeed:

state = combinedSeed[0..3] interpreted big-endian
rand() → float ∈ [0,1)


This sequence is deterministic and fully replayable.

🎯 Deterministic Engine (12-row Plinko)
Peg Map Generation

For each peg:

leftBias = 0.5 + (rand() - 0.5) * 0.2
round to 6 decimals

Drop Column Bias
adj = (dropColumn - 6) * 0.01
bias' = clamp(leftBias + adj, 0, 1)

Row Decisions
if rand() < bias' → LEFT
else → RIGHT (pos += 1)


Final binIndex = pos

Peg Map Hash
pegMapHash = SHA256(JSON.stringify(pegMap))

🗄️ Database Schema (Prisma)
model Round {
  id              String   @id @default(cuid())
  createdAt       DateTime @default(now())
  status          String
  nonce           String
  commitHex       String
  serverSeed      String?
  clientSeed      String
  combinedSeed    String
  pegMapHash      String
  rows            Int
  dropColumn      Int
  binIndex        Int
  payoutMultiplier Float
  betCents        Int
  pathJson        Json
  revealedAt      DateTime?
}

🚀 Running Locally
1. Install
npm install

2. Configure Environment

Create .env:

DATABASE_URL="postgresql://..."

3. Apply Prisma
npx prisma migrate dev

4. Start Dev
npm run dev

🧪 Unit Tests

Located in /tests.

Includes:

Combined seed hashing matches test vector

PRNG produces same first 5 numbers

Peg map deterministic replay

Complete path determinism

Run tests:

npm test

📊 Test Vectors (Fully Supported)
Inputs
rows = 12
serverSeed = "b2a5f3f32a4d9c6ee7a8c1d33456677890abcdeffedcba0987654321ffeeddcc"
nonce = "42"
clientSeed = "candidate-hello"

Derived
commitHex      = bb9acdc67f3f18f33...
combinedSeed   = e1dddf77de27d395...
PRNG first 5   = 0.110616..., 0.762512..., ...
binIndex       = 6 (center)


All matched perfectly.

🎨 Frontend Features
✔️ Smooth 60fps ball animation
✔️ Peg collision SFX (tick)
✔️ Victory SFX
✔️ Confetti burst on landing
✔️ Mute toggle
✔️ Keyboard controls
✔️ prefers-reduced-motion support
✔️ Mobile responsive
✔️ Easter Eggs

Tilt Mode (T)

Debug Grid (G)

🧠 AI Usage (Required Explanation)

I used AI (ChatGPT) primarily for:

1. Architectural planning

Assistance designing PRNG, commit-reveal flow, and deterministic engine.

2. Code generation

Accelerated boilerplate creation:

API route scaffolding

Prisma model

Hash utilities

Deterministic engine structure

All critical logic (PRNG, fairness, peg map, path) was hand-verified and manually adjusted.

3. UI refinement

Generated canvas animation skeleton, which I refactored for 60fps and deterministic path sync.

4. Documentation help

This README was polished with AI assistance.

Why AI didn’t compromise fairness

All generated code was manually reviewed, tested, and validated against test vectors. Determinism critical paths were fully reproduced by hand.

📌 Time Log (Approx.)
Task	Hours
Backend (API + DB + fairness)	3.0
Deterministic engine	1.5
Frontend board + animation	2.0
Verifier page	0.5
Testing	0.5
README + cleanup	0.5
Total	8 hours
🧩 Future Improvements

Real physics with Matter.js while keeping deterministic override

Global session log with real-time updates

Betting history, CSV exports

Shader-based Plinko board (WebGL)

Mobile vibration feedback

📝 Candidate Note

This project was built to satisfy all core requirements within the recommended 8-hour engineering window.
I focused heavily on correctness, readability, determinism, and fairness — the core values of a provably-fair system.