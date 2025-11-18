// src/app/(game)/utils/rng.ts
export class XorShift32 {
  private state: number;

  constructor(seed: number) {
    // Ensure 32-bit unsigned
    this.state = seed >>> 0;
    // Do a few warm-up steps (optional but common). We will not warm-up here to match test vectors exactly.
  }

  // advance and return next uint32
  nextUint32(): number {
    let x = this.state >>> 0;
    x ^= (x << 13) >>> 0;
    x ^= x >>> 17;
    x ^= (x << 5) >>> 0;
    x = x >>> 0;
    this.state = x;
    return x;
  }

  // return float in [0,1)
  next(): number {
    const u = this.nextUint32();
    return u / 2 ** 32;
  }
}
