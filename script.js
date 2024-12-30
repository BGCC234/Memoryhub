const board = document.querySelector('.game-board');
const movesDisplay = document.getElementById('moves');
const timerDisplay = document.getElementById('timer');
const playAgainButton = document.getElementById('play-again');
const difficultySelector = document.getElementById('difficulty');
const bgMusic = document.getElementById('background-music');
const flipSound = document.getElementById('flip-sound');
const playButton = document.getElementById('play-music');
const pauseButton = document.getElementById('pause-music');
const muteButton = document.getElementById('mute-music');
const volumeControl = document.getElementById('volume-control');

// Emojis for different difficulties
const emojiSets = {
  easy: ['🍎', '🍌', '🍒', '🍇'],
  medium: ['🍎', '🍌', '🍒', '🍇', '🍉', '🍓'],
  hard: ['🍎', '🍌', '🍒', '🍇', '🍉', '🍓', '🍍', '🥝', '🍑', '🥥']
};

let icons = [];
let shuffledIcons;
let firstCard, secondCard;
let moves = 0;
let matchCount = 0;
let isFlipping = false;
let timer = 0;
let interval;

// Initialize the game
function initializeGame() {
  const difficulty = difficultySelector.value;
  icons = emojiSets[difficulty].flatMap(icon => [icon, icon]);
  shuffledIcons = icons.sort(() => 0.5 - Math.random());

  // Reset variables
  firstCard = null;
  secondCard = null;
  moves = 0;
  matchCount = 0;
  isFlipping = false;
  timer = 0;

  // Reset UI
  board.innerHTML = '';
  movesDisplay.textContent = moves;
  timerDisplay.textContent = timer;
  playAgainButton.style.display = 'none';

  // Create the board
  shuffledIcons.forEach(icon => {
    const card = document.createElement('div');
    card.classList.add('card');

    const front = document.createElement('div');
    front.classList.add('front');
    front.textContent = '';

    const back = document.createElement('div');
    back.classList.add('back');
    back.textContent = icon;

    card.appendChild(front);
    card.appendChild(back);
    card.addEventListener('click', flipCard);

    board.appendChild(card);
  });

  // Reset and start the timer
  clearInterval(interval);
  startTimer();
}

function flipCard() {
  if (isFlipping || this === firstCard || this.classList.contains('flipped')) return;

  this.classList.add('flipped');
  flipSound.play();

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  checkMatch();
}

function checkMatch() {
  isFlipping = true;
  moves++;
  movesDisplay.textContent = moves;

  const isMatch = firstCard.querySelector('.back').textContent === secondCard.querySelector('.back').textContent;
  if (isMatch) {
    matchCount++;
    if (matchCount === icons.length / 2) endGame();
    resetCards();
  } else {
    setTimeout(() => {
      firstCard.classList.remove('flipped');
      secondCard.classList.remove('flipped');
      resetCards();
    }, 1000);
  }
}

function resetCards() {
  [firstCard, secondCard] = [null, null];
  isFlipping = false;
}

function startTimer() {
  interval = setInterval(() => {
    timer++;
    timerDisplay.textContent = timer;
  }, 1000);
}

function endGame() {
  clearInterval(interval);
  setTimeout(() => {
    alert(`You won! Moves: ${moves}, Time: ${timer} seconds`);
    playAgainButton.style.display = 'block';
  }, 500);
}

// Music controls
playButton.addEventListener('click', () => bgMusic.play());
pauseButton.addEventListener('click', () => bgMusic.pause());
muteButton.addEventListener('click', () => {
  bgMusic.muted = !bgMusic.muted;
  muteButton.textContent = bgMusic.muted ? 'Unmute' : 'Mute';
});
volumeControl.addEventListener('input', () => bgMusic.volume = volumeControl.value);

// Restart the game
playAgainButton.addEventListener('click', initializeGame);

// Start a new game when the difficulty changes
difficultySelector.addEventListener('change', initializeGame);

// Start the game when the page loads
window.addEventListener('load', () => {
  bgMusic.volume = 0.5; // Default volume
  bgMusic.play();
  initializeGame();
});
