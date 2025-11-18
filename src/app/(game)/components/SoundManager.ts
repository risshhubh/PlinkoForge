import confetti from "canvas-confetti";

export const SoundManager = {
  playCheer: () => {
    const audio = new Audio("/sounds/cheer.mp3");
    audio.play();
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  },
};
