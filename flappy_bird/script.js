const bird = document.getElementById("bird");
let lastPipeX = null; // Untuk melacak pipa terakhir yang dilewati
const gameBoard = document.getElementById("game-board");
const startButton = document.getElementById("start-button");
const scoreDisplay = document.getElementById("score");

let birdY = 250; // Posisi vertikal burung
let gravity = 3; // Gaya gravitasi awal
let currentGravity = gravity; // Gravitasi saat ini
let isGameOver = false;
let score = 0;
let pipes = [];
let gameInterval;
let pipeInterval;
let pipeMovementInterval; // Tambahkan variabel global baru

function startGame() {
  birdY = 250;
  score = 0;
  isGameOver = false;
  pipes = [];
  scoreDisplay.textContent = "Skor: 0";
  bird.style.top = birdY + "px";
  gameBoard.innerHTML = ""; // Kosongkan papan permainan
  gameBoard.appendChild(bird); // Tambahkan burung kembali ke papan
  startButton.style.display = "none"; // Sembunyikan tombol mulai
  gameInterval = setInterval(updateGame, 20);
  pipeInterval = setInterval(createPipe, 1500); // Interval tetap 1500 ms

  // Mulai pergerakan pipa sekali saja
  pipeMovementInterval = setInterval(movePipes, 20);
}

function updateGame() {
  if (isGameOver) return;

  currentGravity += 0.2; // Tingkatkan gravitasi seiring waktu
  birdY += currentGravity; // Gunakan gravitasi saat ini
  bird.style.top = birdY + "px";

  // Cek tabrakan dengan pipa
  for (let i = 0; i < pipes.length; i++) {
    const pipe = pipes[i];
    const pipeRect = pipe.getBoundingClientRect();
    const birdRect = bird.getBoundingClientRect();

    // Cek tabrakan
    if (
      birdRect.left < pipeRect.right &&
      birdRect.right > pipeRect.left &&
      birdRect.top < pipeRect.bottom &&
      birdRect.bottom > pipeRect.top
    ) {
      endGame();
    }

    // Cek jika burung melewati pipa
    if (pipeRect.right < birdRect.left && !pipe.passed) {
      score += 1;
      pipe.passed = true; // Tandai pipa sudah dilewati
      scoreDisplay.textContent = "Skor: " + score;
    }
  }

  // Cek jika burung jatuh
  if (birdY >= gameBoard.clientHeight - 30) {
    endGame();
  }
}

function createPipe() {
  const pipeHeight = Math.random() * (gameBoard.clientHeight - 200) + 50; // Tinggi pipa acak
  const pipeGap = 150; // Jarak antara pipa atas dan bawah

  // Pipa atas
  const topPipe = document.createElement("div");
  topPipe.classList.add("pipe");
  topPipe.style.height = pipeHeight + "px";
  topPipe.style.left = "400px"; // Posisi pipa
  gameBoard.appendChild(topPipe);
  pipes.push(topPipe);

  // Pipa bawah
  const bottomPipe = document.createElement("div");
  bottomPipe.classList.add("pipe");
  bottomPipe.style.height =
    gameBoard.clientHeight - pipeHeight - pipeGap + "px";
  bottomPipe.style.left = "400px"; // Posisi pipa
  bottomPipe.style.top = pipeHeight + pipeGap + "px"; // Posisi pipa bawah
  gameBoard.appendChild(bottomPipe);
  pipes.push(bottomPipe);
}

function movePipes() {
  if (isGameOver) return;

  for (let i = 0; i < pipes.length; i++) {
    const pipe = pipes[i];
    const pipeLeft = parseInt(pipe.style.left);
    pipe.style.left = pipeLeft - 5 + "px"; // Gerakkan pipa ke kiri

    if (pipeLeft < -50) {
      pipe.remove();
      pipes.splice(i, 1);
      i--; // Kurangi indeks untuk menghindari kesalahan
    }
  }
}

function endGame() {
  isGameOver = true;
  clearInterval(gameInterval);
  clearInterval(pipeInterval);
  clearInterval(pipeMovementInterval);
  startButton.style.display = "block"; // Tampilkan tombol mulai
  alert("Game Over! Skor Anda: " + score);
}

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp" || event.key === " ") {
    birdY -= 75;
    currentGravity = gravity; // Reset gravitasi ke nilai awal saat melompat
    bird.style.top = birdY + "px";
  }
});

startButton.addEventListener("click", startGame);
