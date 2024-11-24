const cards = [
  "A",
  "A",
  "B",
  "B",
  "C",
  "C",
  "D",
  "D",
  "E",
  "E",
  "F",
  "F",
  "G",
  "G",
  "H",
  "H",
];

let gameBoard = document.getElementById("game-board");
let messageDisplay = document.getElementById("message");
let restartButton = document.getElementById("restart-button");
let startButton = document.getElementById("start-button");
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchedCards = 0;
let chances = 10; // Menambahkan variabel kesempatan

// Mengacak kartu
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Membuat papan permainan
function createBoard() {
  shuffle(cards);
  gameBoard.innerHTML = "";
  matchedCards = 0;
  messageDisplay.textContent = `Kesempatan: ${chances}`; // Menampilkan kesempatan
  restartButton.classList.add("hidden");
  startButton.classList.add("hidden"); // Sembunyikan tombol mulai

  cards.forEach((card) => {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.dataset.cardValue = card;
    cardElement.addEventListener("click", flipCard);
    gameBoard.appendChild(cardElement);
  });
}

// Menyembunyikan kartu
function hideCards() {
  const allCards = document.querySelectorAll(".card");
  allCards.forEach((card) => {
    card.classList.remove("flipped");
    card.textContent = ""; // Mengosongkan teks kartu
  });
}

// Membalik kartu
function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add("flipped");
  this.textContent = this.dataset.cardValue;

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  lockBoard = true;

  checkForMatch();
}

// Memeriksa kecocokan
function checkForMatch() {
  if (firstCard.dataset.cardValue === secondCard.dataset.cardValue) {
    disableCards();
    matchedCards++;

    if (matchedCards === cards.length / 2) {
      messageDisplay.textContent = "Selamat! Anda menang!";
      restartButton.classList.remove("hidden");
    }
  } else {
    chances--; // Mengurangi kesempatan
    messageDisplay.textContent = `Kesempatan: ${chances}`; // Menampilkan kesempatan yang tersisa

    if (chances === 0) {
      messageDisplay.textContent = "Kesempatan habis! Anda kalah!";
      restartButton.classList.remove("hidden");
    } else {
      unflipCards();
    }
  }
}

// Menonaktifkan kartu yang cocok
function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);
  resetBoard();
}

// Mengembalikan kartu yang tidak cocok
function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    firstCard.textContent = "";
    secondCard.textContent = "";
    resetBoard();
  }, 1000);
}

// Mengatur ulang papan
function resetBoard() {
  [firstCard, secondCard, lockBoard] = [null, null, false];
}

// Memulai permainan
function startGame() {
  createBoard();
  // Menampilkan kartu selama 3 detik
  const allCards = document.querySelectorAll(".card");
  allCards.forEach((card) => {
    card.classList.add("flipped");
    card.textContent = card.dataset.cardValue; // Tampilkan nilai kartu
  });

  setTimeout(() => {
    hideCards();
  }, 1500);
}

// Memulai ulang permainan
restartButton.addEventListener("click", () => {
  chances = 10; // Reset kesempatan
  startGame();
});

// Menangani klik pada tombol mulai
startButton.addEventListener("click", startGame);

// Memulai permainan pertama kali
startButton.classList.remove("hidden"); // Tampilkan tombol mulai
