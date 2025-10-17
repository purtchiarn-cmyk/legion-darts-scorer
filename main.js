// DOM elements
const scoreInput = document.getElementById("score-input");
const submitTurn = document.getElementById("submit-turn");
const undoTurn = document.getElementById("undo-turn");
const bustAlert = document.getElementById("bust-alert");

const playerA = document.getElementById("player-a");
const playerB = document.getElementById("player-b");

let scores = {
  A: 501,
  B: 501,
};

let currentPlayer = "A";
let history = [];

// Load match settings from localStorage
const settings = JSON.parse(localStorage.getItem("matchSettings")) || {
  playerA: "Player A",
  playerB: "Player B",
  matchType: "Friendly",
  legs: 5,
  tripod: false,
  voice: false,
  access: false
};

// Apply settings to UI
document.getElementById("match-title").textContent = `Match: ${settings.playerA} vs ${settings.playerB}`;
document.getElementById("match-meta").textContent = `${settings.matchType} Match — Leg 1 of ${settings.legs}`;
playerA.querySelector(".name").textContent = settings.playerA;
playerB.querySelector(".name").textContent = settings.playerB;

if (settings.access) {
  document.body.classList.add("accessibility-mode");
}

// Update scoreboard
function updateDisplay() {
  playerA.querySelector(".score").textContent = scores.A;
  playerB.querySelector(".score").textContent = scores.B;

  playerA.querySelector(".3da").textContent = `3DA: ${calculate3DA("A")}`;
  playerB.querySelector(".3da").textContent = `3DA: ${calculate3DA("B")}`;
}

// Handle turn submission
submitTurn.addEventListener("click", () => {
  const input = parseInt(scoreInput.value, 10);
  if (isNaN(input) || input < 0 || input > 180) return;

  const currentScore = scores[currentPlayer];
  const newScore = currentScore - input;

  if (newScore < 0) {
    bustAlert.hidden = false;
    return;
  }

  bustAlert.hidden = true;
  history.push({ player: currentPlayer, score: input, previous: currentScore });
  scores[currentPlayer] = newScore;

  currentPlayer = currentPlayer === "A" ? "B" : "A";
  scoreInput.value = "";
  updateDisplay();
});

// Undo last turn
undoTurn.addEventListener("click", () => {
  const last = history.pop();
  if (!last) return;

  scores[last.player] = last.previous;
  currentPlayer = last.player;
  bustAlert.hidden = true;
  updateDisplay();
});

// End Match button
document.getElementById("end-match").addEventListener("click", () => {
  const finalScoreA = scores.A;
  const finalScoreB = scores.B;

  const daA = calculate3DA("A");
  const daB = calculate3DA("B");

  localStorage.setItem("matchStats", JSON.stringify({
    finalScoreA,
    finalScoreB,
    daA,
    daB
  }));

  window.location.href = "summary.html";
});

// Calculate 3DA
function calculate3DA(player) {
  const turns = history.filter(h => h.player === player);
  const total = turns.reduce((sum, h) => sum + h.score, 0);
  const darts = turns.length * 3;
  return darts ? (total / darts * 3).toFixed(1) : "—";
}

// Initial display
updateDisplay
