const hold = document.getElementById("holdCircle");
const progress = document.getElementById("progress");
const music = document.getElementById("bgMusic");

let holdTime = 0;
let timer = null;
let musicStarted = false;

const TOTAL = 408; // circle length

hold.style.touchAction = "none";

hold.addEventListener("pointerdown", startHold);
hold.addEventListener("pointerup", stopHold);
hold.addEventListener("pointerleave", stopHold);
hold.addEventListener("pointercancel", stopHold);

function startHold(e) {
  e.preventDefault();
  if (timer) return;

  if (!musicStarted) {
    music.volume = 0.4;
    music.play().catch(() => {});
    musicStarted = true;
  }

  holdTime = 0;
  progress.style.strokeDashoffset = TOTAL;

  timer = setInterval(() => {
    holdTime++;
    progress.style.strokeDashoffset = TOTAL - holdTime * 4;

    if (holdTime >= 102) {
      stopHold();
      nextPage(2);
    }
  }, 20);
}

function stopHold() {
  clearInterval(timer);
  timer = null;
}

/* PAGE CHANGE */
function nextPage(n) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById("page" + n).classList.add("active");

  if (n === 3 || n === 5) launchConfetti();
}

/* DRAG (mobile-safe) */
document.querySelectorAll(".draggable").forEach(card => {
  let offsetX, offsetY;

  card.addEventListener("pointerdown", e => {
    offsetX = e.clientX - card.offsetLeft;
    offsetY = e.clientY - card.offsetTop;
    card.setPointerCapture(e.pointerId);
  });

  card.addEventListener("pointermove", e => {
    if (offsetX !== undefined) {
      card.style.left = e.clientX - offsetX + "px";
      card.style.top = e.clientY - offsetY + "px";
    }
  });

  card.addEventListener("pointerup", () => {
    offsetX = offsetY = undefined;
  });
});

/* CONFETTI */
const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

let confetti = [];

function launchConfetti() {
  confetti = [];
  for (let i = 0; i < 150; i++) {
    confetti.push({
      x: Math.random() * canvas.width,
      y: -20,
      r: Math.random() * 6 + 4,
      d: Math.random() * 4 + 2,
      c: `hsl(${Math.random() * 360},100%,70%)`
    });
  }
  animateConfetti();
}

function animateConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  confetti.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = p.c;
    ctx.fill();
    p.y += p.d;
  });
  confetti = confetti.filter(p => p.y < canvas.height);
  if (confetti.length) requestAnimationFrame(animateConfetti);
}