const board = document.getElementById("game-board");
const startButton = document.getElementById("start-button");
const instructions = document.getElementById("instructions"); // Ambil elemen instruksi
const gameOverMessage = document.getElementById("game-over-message"); // Ambil elemen pesan kalah
const boardSize = 20;
let snake = [{ x: 9, y: 9 }];
let direction = { x: 0, y: 0 };
let hasStartedMoving = false; // Tambah flag untuk mengecek apakah user sudah menekan arrow key

document.addEventListener("keydown", (e) => {
  if (!hasStartedMoving) {
    instructions.style.display = "none"; // Sembunyikan instruksi saat user pertama kali menekan arrow key
    hasStartedMoving = true;
  }
});
let food = {};
let gameInterval;

function startGame() {
  snake = [{ x: 9, y: 9 }];
  direction = { x: 0, y: 0 };
  placeFood();
  if (gameInterval) clearInterval(gameInterval);
  gameInterval = setInterval(updateGame, 100);
  startButton.textContent = "Ulang"; // Ubah teks tombol menjadi "Ulang"
  gameOverMessage.classList.add("hidden"); // Sembunyikan pesan kalah
}

function placeFood() {
  food = {
    x: Math.floor(Math.random() * boardSize),
    y: Math.floor(Math.random() * boardSize),
  };
}

function updateGame() {
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  // Check for collision with food
  if (head.x === food.x && head.y === food.y) {
    snake.unshift(head);
    placeFood();
  } else {
    snake.unshift(head);
    snake.pop();
  }

  // Check for collision with walls or self
  if (
    head.x < 0 ||
    head.x >= boardSize ||
    head.y < 0 ||
    head.y >= boardSize ||
    collisionWithSelf(head)
  ) {
    clearInterval(gameInterval);
    gameOverMessage.classList.remove("hidden"); // Tampilkan pesan kalah
    startButton.textContent = "Ulang"; // Ubah teks tombol menjadi "Ulang" saat kalah
    instructions.style.display = "block"; // Tampilkan instruksi saat permainan berakhir
  }

  draw();
}

function collisionWithSelf(head) {
  return snake
    .slice(1)
    .some((segment) => segment.x === head.x && segment.y === head.y);
}

function draw() {
  board.innerHTML = "";
  snake.forEach((segment) => {
    const snakeElement = document.createElement("div");
    snakeElement.classList.add("snake");
    snakeElement.style.width = "20px";
    snakeElement.style.height = "20px";
    snakeElement.style.left = `${segment.x * 20}px`;
    snakeElement.style.top = `${segment.y * 20}px`;
    board.appendChild(snakeElement);
  });

  const foodElement = document.createElement("div");
  foodElement.classList.add("food");
  foodElement.style.width = "20px";
  foodElement.style.height = "20px";
  foodElement.style.left = `${food.x * 20}px`;
  foodElement.style.top = `${food.y * 20}px`;
  board.appendChild(foodElement);
}

document.addEventListener("keydown", (event) => {
  // Sembunyikan instruksi hanya saat tombol panah ditekan
  if (event.key.startsWith("Arrow")) {
    instructions.style.display = "none";
  }

  switch (event.key) {
    case "ArrowUp":
      if (direction.y === 0) direction = { x: 0, y: -1 };
      break;
    case "ArrowDown":
      if (direction.y === 0) direction = { x: 0, y: 1 };
      break;
    case "ArrowLeft":
      if (direction.x === 0) direction = { x: -1, y: 0 };
      break;
    case "ArrowRight":
      if (direction.x === 0) direction = { x: 1, y: 0 };
      break;
  }
});

// Event listener untuk tombol
startButton.addEventListener("click", () => {
  if (startButton.textContent === "Ulang") {
    startGame(); // Jika tombol "Ulang", mulai permainan lagi
  } else {
    startGame(); // Jika tombol "Mulai", mulai permainan
  }
});
