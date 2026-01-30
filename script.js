let current = 1;
const screens = document.querySelectorAll(".screen");
const music = document.getElementById("bgMusic");

/* Scroll logic */
window.addEventListener("scroll", () => {
  if (window.scrollY > 50 && current < 3) {
    screens[current - 1].classList.remove("active");
    screens[current].classList.add("active");
    current++;
    window.scrollTo(0, 0);
  }
});

/* Keyboard navigation */
window.addEventListener("keydown", (e) => {
  if ((e.key === "ArrowDown" || e.key === " ") && current < 3) {
    screens[current - 1].classList.remove("active");
    screens[current].classList.add("active");
    current++;
  }
});

/* Floating hearts */
setInterval(() => {
  const heart = document.createElement("span");
  heart.innerHTML = "❤️";
  heart.style.left = Math.random() * 100 + "vw";
  heart.style.animationDuration = 4 + Math.random() * 3 + "s";
  document.getElementById("hearts-container").appendChild(heart);

  setTimeout(() => heart.remove(), 7000);
}, 300);

/* Buttons */
function nope() {
  alert("Try again na baby 😌💗");
}

function startPuzzle() {
  music.play(); // 🎵 START LOVER HERE
  switchScreen(3, 4);
  createPuzzle();
}

function switchScreen(from, to) {
  screens[from - 1].classList.remove("active");
  screens[to - 1].classList.add("active");
}

/* Puzzle */
const puzzle = document.getElementById("puzzle");
let order = [];
let draggedIndex = null;
let draggedElement = null;

function createPuzzle() {
  order = [...Array(9).keys()].sort(() => Math.random() - 0.5);
  puzzle.innerHTML = "";

  order.forEach((pos, i) => {
    const div = document.createElement("div");
    div.className = "piece";
    div.draggable = true;
    div.dataset.index = i;
    div.style.backgroundPosition =
      `-${(pos % 3) * 100}px -${Math.floor(pos / 3) * 100}px`;
    
    // Drag events
    div.addEventListener("dragstart", (e) => {
      draggedIndex = i;
      draggedElement = div;
      div.style.opacity = "0.5";
    });
    
    div.addEventListener("dragend", () => {
      div.style.opacity = "1";
    });
    
    div.addEventListener("dragover", (e) => {
      e.preventDefault();
      div.style.transform = "scale(1.1)";
    });
    
    div.addEventListener("dragleave", () => {
      div.style.transform = "scale(1)";
    });
    
    div.addEventListener("drop", (e) => {
      e.preventDefault();
      div.style.transform = "scale(1)";
      if (draggedIndex !== null && draggedIndex !== i) {
        swapPieces(draggedIndex, i);
        draggedIndex = null;
        draggedElement = null;
      }
    });
    
    puzzle.appendChild(div);
  });
}

function swapPieces(index1, index2) {
  // Swap in order array
  [order[index1], order[index2]] = [order[index2], order[index1]];
  
  // Get the actual DOM elements
  const pieces = document.querySelectorAll(".piece");
  const piece1 = pieces[index1];
  const piece2 = pieces[index2];
  
  // Update background positions with animation
  piece1.style.transition = "background-position 0.3s ease";
  piece2.style.transition = "background-position 0.3s ease";
  
  const pos1 = order[index1];
  const pos2 = order[index2];
  
  piece1.style.backgroundPosition = `-${(pos1 % 3) * 100}px -${Math.floor(pos1 / 3) * 100}px`;
  piece2.style.backgroundPosition = `-${(pos2 % 3) * 100}px -${Math.floor(pos2 / 3) * 100}px`;
  
  // Check win after animation
  setTimeout(() => checkWin(), 300);
}

function checkWin() {
  if (order.every((v, i) => v === i)) {
    setTimeout(() => switchScreen(4, 5), 500);
  }
}

/* Final Buttons */
function finalYes() {
  document.getElementById("finalMessage").innerHTML =
    "🐻🤎 I LOVE YOU 🤎🐻";
  startConfetti();
}

function finalNo() {
  document.getElementById("finalMessage").innerHTML =
    "🐻🤎 Please na baby 🥺🤎🐻";
}

/* Confetti */
function startConfetti() {
  const canvas = document.getElementById("confetti");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const confetti = Array.from({ length: 200 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 6 + 2,
    d: Math.random() * 5 + 1
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    confetti.forEach(c => {
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsl(${Math.random() * 360}, 100%, 70%)`;
      ctx.fill();
      c.y += c.d;
      if (c.y > canvas.height) c.y = 0;
    });
    requestAnimationFrame(draw);
  }
  draw();
}
