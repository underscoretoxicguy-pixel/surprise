const hold = document.getElementById("holdCircle");
const progress = document.getElementById("progress");
const music = document.getElementById("bgMusic");

let holdTime = 0;
let timer = null;
let musicStarted = false;

// Prevent mobile default behavior
hold.addEventListener("touchstart", e => e.preventDefault(), { passive: false });

hold.addEventListener("mousedown", startHold);
hold.addEventListener("touchstart", startHold);

hold.addEventListener("mouseup", stopHold);
hold.addEventListener("mouseleave", stopHold);
hold.addEventListener("touchend", stopHold);
hold.addEventListener("touchcancel", stopHold);

function startHold() {
  if (timer) return; // prevent double start

  if (!musicStarted) {
    music.volume = 0.4;
    music.play().catch(() => {});
    musicStarted = true;
  }

  holdTime = 0;
  progress.style.strokeDashoffset = 408;

  timer = setInterval(() => {
    holdTime++;
    progress.style.strokeDashoffset = 408 - holdTime * 4;

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

/* PAGE SWITCH */
function nextPage(n) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById("page" + n).classList.add("active");

  if (n === 3 || n === 5) launchConfetti();
}

/* DRAGGABLE CARDS */
document.querySelectorAll(".draggable").forEach(card => {
  let offsetX, offsetY;

  card.addEventListener("touchstart", e => {
    const t = e.touches[0];
    offsetX = t.clientX - card.offsetLeft;
    offsetY = t.clientY - card.offsetTop;
  });

  card.addEventListener("touchmove", e => {
    const t = e.touches[0];
    card.style.left = t.clientX - offsetX + "px";
    card.style.top = t.clientY - offsetY + "px";
  });
});

/* CONFETTI */
const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;

let confetti = [];

function launchConfetti() {
  confetti = [];
  for (let i = 0; i < 150; i++) {
    confetti.push({
      x: Math.random() * canvas.width,
      y: -20,
      r: Math.random() * 6 + 4,
      d: Math.random() * 4 + 2,
      c: hsl(${Math.random() * 360},100%,70%)
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

