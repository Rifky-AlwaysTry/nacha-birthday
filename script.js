
const openBtn = document.getElementById("openBtn");
const memories = document.getElementById("memories");

const letterBtn = document.getElementById("letterBtn");
const loveLetter = document.getElementById("loveLetter");
const letterBtnText = document.getElementById("letterBtnText");

const wishBtn = document.getElementById("wishBtn");
const wishMessage = document.getElementById("wishMessage");
const flame = document.getElementById("flame");
const confetti = document.getElementById("confetti");

const musicBtn = document.getElementById("musicBtn");
const musicLabel = document.getElementById("musicLabel");
const bgMusic = document.getElementById("bgMusic");

const floatingHearts = document.querySelector(".floating-hearts");
const heartSymbols = ["♡", "♥", "ღ"];

let candleBlown = false;
let musicPlaying = false;

// 1. SMOOTH AUTO-SCROLL
let autoScrollFrame = null;
let autoScrollActive = false;
let lastFrameTime = 0;

const scrollSpeed = 30; // pixel per detik

function smoothAutoScroll(timestamp) {
  if (!autoScrollActive) return;

  if (lastFrameTime === 0) {
    lastFrameTime = timestamp;
  }

  const deltaTime = timestamp - lastFrameTime;
  lastFrameTime = timestamp;

  // Kecepatan konsisten pada berbagai refresh rate.
  window.scrollBy(0, scrollSpeed * deltaTime / 1000);

  const atBottom =
    window.innerHeight + window.scrollY >=
    document.documentElement.scrollHeight - 2;

  if (atBottom) {
    stopAutoScroll();
    return;
  }

  autoScrollFrame = requestAnimationFrame(smoothAutoScroll);
}

function startAutoScroll() {
  if (autoScrollActive) return;

  autoScrollActive = true;
  lastFrameTime = 0;
  autoScrollFrame = requestAnimationFrame(smoothAutoScroll);
}

function stopAutoScroll() {
  autoScrollActive = false;
  lastFrameTime = 0;

  if (autoScrollFrame !== null) {
    cancelAnimationFrame(autoScrollFrame);
    autoScrollFrame = null;
  }
}

// Mulai scroll setelah tombol kejutan ditekan.
openBtn.addEventListener("click", () => {
  stopAutoScroll();

  memories.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });

  // Tunggu smooth scroll awal selesai.
  setTimeout(startAutoScroll, 1000);
});

// Hentikan jika pengunjung ingin menggulir sendiri.
window.addEventListener("wheel", stopAutoScroll, {
  passive: true
});

window.addEventListener("touchstart", stopAutoScroll, {
  passive: true
});

window.addEventListener("keydown", stopAutoScroll);

// 2. BUKA DAN TUTUP SURAT
letterBtn.addEventListener("click", () => {
  const isOpen = !loveLetter.hidden;

  loveLetter.hidden = isOpen;

  letterBtn.setAttribute(
    "aria-expanded",
    String(!isOpen)
  );

  letterBtnText.textContent = isOpen
    ? "Tap to open your letter"
    : "Tap to close your letter";

  if (!isOpen) {
    loveLetter.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }
});

// 3. MUSIK LATAR
musicBtn.addEventListener("click", async () => {
  if (!musicPlaying) {
    try {
      await bgMusic.play();
    } catch (error) {
      musicLabel.textContent = "Check your song file";
      console.error("Musik gagal diputar:", error);
    }
  } else {
    bgMusic.pause();
  }
});

// Sinkronkan status tombol musik.
bgMusic.addEventListener("pause", () => {
  musicPlaying = false;
  musicLabel.textContent = "Play our song";
});

bgMusic.addEventListener("play", () => {
  musicPlaying = true;
  musicLabel.textContent = "Pause our song";
});

// 4. TIUP LILIN
wishBtn.addEventListener("click", () => {
  if (candleBlown) return;

  candleBlown = true;
  flame.classList.add("out");

  wishMessage.textContent =
    "May all your beautiful wishes come true. ♡";

  wishBtn.textContent = "Wish sent with love ♡";
  wishBtn.disabled = true;
  wishBtn.style.opacity = "0.7";

  launchConfetti();
});

// 5. ANIMASI CONFETTI
function launchConfetti() {
  const symbols = ["♡", "✦", "✿", "♥", "✧"];

  for (let i = 0; i < 45; i++) {
    const piece = document.createElement("span");

    piece.textContent =
      symbols[Math.floor(Math.random() * symbols.length)];

    piece.style.setProperty(
      "--x",
      `${Math.random() * 100}vw`
    );

    piece.style.setProperty(
      "--duration",
      `${2 + Math.random() * 3}s`
    );

    confetti.appendChild(piece);

    piece.addEventListener("animationend", () => {
      piece.remove();
    });
  }
}

// 6. HATI MELAYANG
function createFloatingHeart() {
  if (document.hidden || !floatingHearts) return;

  const heart = document.createElement("span");

  heart.textContent =
    heartSymbols[Math.floor(Math.random() * heartSymbols.length)];

  heart.style.left = `${Math.random() * 100}vw`;
  heart.style.fontSize = `${12 + Math.random() * 18}px`;

  const duration = 8 + Math.random() * 8;

  heart.style.setProperty("--duration", `${duration}s`);

  floatingHearts.appendChild(heart);

  heart.addEventListener("animationend", () => {
    heart.remove();
  });
}

let heartTimer = null;

function startHeartAnimation() {
  if (heartTimer !== null) return;

  heartTimer = setInterval(createFloatingHeart, 1800);
}

function stopHeartAnimation() {
  clearInterval(heartTimer);
  heartTimer = null;
}

startHeartAnimation();

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    stopHeartAnimation();
    stopAutoScroll();
  } else {
    startHeartAnimation();
  }
});
