let hold = document.getElementById("holdCircle");
let progress = document.getElementById("progress");
let music = document.getElementById("bgMusic");
let holdTime = 0, timer, musicStarted = false;

hold.addEventListener("mousedown", startHold);
hold.addEventListener("touchstart", startHold);
hold.addEventListener("mouseup", stopHold);
hold.addEventListener("touchend", stopHold);

function startHold() {
  if (!musicStarted) {
    music.volume = 0.4;
    music.play();
    musicStarted = true;
  }
  timer = setInterval(() => {
    holdTime++;
    progress.style.strokeDashoffset = 408 - holdTime * 4;
    if (holdTime >= 102) {
      clearInterval(timer);
      nextPage(2);
    }
  }, 20);
}

function stopHold() {
  clearInterval(timer);
}

function nextPage(n) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById("page" + n).classList.add("active");
  if (n === 3 || n === 5) launchConfetti();
}

/* Drag */
document.querySelectorAll(".draggable").forEach(card => {
  card.onmousedown = e => {
    let shiftX = e.clientX - card.offsetLeft;
    let shiftY = e.clientY - card.offsetTop;
    document.onmousemove = ev => {
      card.style.left = ev.pageX - shiftX + "px";
      card.style.top = ev.pageY - shiftY + "px";
    };
    document.onmouseup = () => document.onmousemove = null;
  };
});

/* Confetti */
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
      c: hsl(${Math.random()*360},100%,70%)
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
