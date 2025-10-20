// ------------------------------
// GLOBAL STATE
// ------------------------------
let players = [
  { name: "Home", score: 501, darts: 0, legs: 0 },
  { name: "Away", score: 501, darts: 0, legs: 0 }
];
let currentPlayer = 0;
let currentDart = 0;
let turnScores = [];
let multiplier = 1;

// ------------------------------
// START MATCH
// ------------------------------
function startMatch() {
  const home = document.getElementById("homeName").value || "Home";
  const away = document.getElementById("awayName").value || "Away";
  const bullWinner = parseInt(document.getElementById("bullWinner").value);

  players[0].name = home;
  players[1].name = away;
  currentPlayer = bullWinner;

  document.getElementById("homeLabel").innerText = `${home} (P1)`;
  document.getElementById("awayLabel").innerText = `${away} (P2)`;

  document.getElementById("start-screen").classList.add("hidden");
  document.getElementById("game-screen").classList.remove("hidden");

  updateDisplay();
}

// ------------------------------
// DISPLAY UPDATES
// ------------------------------
function updateDisplay() {
  players.forEach((p, i) => {
    const scoreEl = document.querySelectorAll(".player-score .score")[i];
    const daEl = document.querySelectorAll(".player-score .three-da")[i];
    const playerBox = document.querySelectorAll(".player-score")[i];

    scoreEl.textContent = p.score;
    daEl.textContent = `3DA: ${calc3DA(p).toFixed(2)}`;
    playerBox.classList.toggle("active", i === currentPlayer);
  });

  // Show glow pulse
  const glowBox = document.querySelectorAll(".player-score")[currentPlayer];
  glowBox.classList.add("glow");
  setTimeout(() => glowBox.classList.remove("glow"), 800);

  // Reset dart display
  for (let i = 1; i <= 3; i++) {
    const btn = document.getElementById(`dart${i}`);
    btn.textContent = turnScores[i - 1] !== undefined ? turnScores[i - 1] : "–";
  }
}

// ------------------------------
// CALCULATE 3 DART AVERAGE
// ------------------------------
function calc3DA(p) {
  if (p.darts === 0) return 0;
  const scored = 501 - p.score;
  return (scored / p.darts) * 3;
}

// ------------------------------
// MULTIPLIER HANDLING
// ------------------------------
document.getElementById("doubleBtn").addEventListener("click", () => {
  multiplier = multiplier === 2 ? 1 : 2;
  highlightButton("doubleBtn", multiplier === 2);
});
document.getElementById("trebleBtn").addEventListener("click", () => {
  multiplier = multiplier === 3 ? 1 : 3;
  highlightButton("trebleBtn", multiplier === 3);
});

function highlightButton(id, active) {
  const btn = document.getElementById(id);
  btn.style.background = active ? "#004aad" : "#d7e3ff";
  btn.style.color = active ? "#fff" : "#000";
}

// ------------------------------
// NUMPAD BUTTONS
// ------------------------------
document.querySelectorAll(".numpad-grid button").forEach((btn) => {
  const val = btn.innerText.trim();
  if (!isNaN(val) && val !== "") {
    btn.addEventListener("click", () => scoreDart(parseInt(val)));
  }
});

document.getElementById("btn25").addEventListener("click", () => scoreDart(25));
document.getElementById("btnBull").addEventListener("click", () => scoreDart(50));
document.getElementById("noScoreBtn").addEventListener("click", () => scoreDart(0));

// ------------------------------
// SCORE A DART
// ------------------------------
function scoreDart(value) {
  if (turnScores.length >= 3) return; // max 3 darts

  const actual = value * multiplier;
  const newScore = players[currentPlayer].score - actual;

  turnScores.push(actual);
  currentDart++;
  multiplier = 1;
  resetMultiplierButtons();

  if (newScore < 0) {
    // Bust
    showBust();
    endTurn(true);
    return;
  } else if (newScore === 0) {
    // Win (must be double or bull)
    if (value === 50 || multiplier === 2) {
      players[currentPlayer].score = 0;
      players[currentPlayer].darts += turnScores.length;
      announceWinner();
      return;
    } else {
      showBust();
      endTurn(true);
      return;
    }
  }

  players[currentPlayer].score = newScore;
  players[currentPlayer].darts += 1;
  updateDisplay();
}

function resetMultiplierButtons() {
  highlightButton("doubleBtn", false);
  highlightButton("trebleBtn", false);
}

// ------------------------------
// END TURN
// ------------------------------
document.getElementById("submitBtn").addEventListener("click", () => endTurn(false));
function endTurn(bust) {
  if (bust) {
    // revert score to start of turn
    const scored = turnScores.reduce((a,b)=>a+b,0);
    players[currentPlayer].score += scored;
  }

  // reset turn
  turnScores = [];
  currentDart = 0;
  currentPlayer = currentPlayer === 0 ? 1 : 0;
  updateDisplay();
}

// ------------------------------
// UNDO FUNCTIONS
// ------------------------------
document.getElementById("undoDartBtn").addEventListener("click", undoDart);

function undoDart() {
  if (turnScores.length === 0) return;
  const last = turnScores.pop();
  players[currentPlayer].score += last;
  players[currentPlayer].darts = Math.max(0, players[currentPlayer].darts - 1);
  updateDisplay();
}

// ------------------------------
// MODALS
// ------------------------------
document.getElementById("statsBtn").addEventListener("click", openStats);
document.getElementById("checkoutBtn").addEventListener("click", openCheckout);

function openStats() {
  const modal = document.getElementById("statsModal");
  const sum = players.map(p => {
    return `${p.name}: 3DA ${calc3DA(p).toFixed(2)} | Darts: ${p.darts}`;
  }).join("<br>");
  document.getElementById("statsSummary").innerHTML = sum;
  modal.classList.remove("hidden");
}

function closeStats() {
  document.getElementById("statsModal").classList.add("hidden");
}

function openCheckout() {
  const score = players[currentPlayer].score;
  const modal = document.getElementById("checkoutModal");
  const text = getCheckoutText(score);
  document.getElementById("checkoutDisplay").innerHTML = text;
  modal.classList.remove("hidden");
}

function closeCheckout() {
  document.getElementById("checkoutModal").classList.add("hidden");
}

// ------------------------------
// CHECKOUT LOGIC (TEXT ONLY)
// ------------------------------
function getCheckoutText(score) {
  if (score > 170) return "No checkout available.";
  const routes = {
    170: "T20 T20 Bull", 167: "T20 T19 Bull", 164: "T20 T18 Bull",
    161: "T20 T17 Bull", 160: "T20 T20 D20", 158: "T20 T20 D19",
    157: "T20 T19 D20", 156: "T20 T20 D18", 155: "T20 T19 D19",
    154: "T20 T18 D20", 153: "T20 T19 D18", 152: "T20 T20 D16",
    151: "T20 T17 D20", 150: "T20 T18 D18", 149: "T20 T19 D16",
    148: "T20 T16 D20", 147: "T20 T17 D18", 146: "T20 T18 D16",
    145: "T20 T15 D20", 144: "T20 T20 D12", 143: "T20 T17 D16",
    142: "T20 T14 D20", 141: "T20 T19 D12", 140: "T20 T16 D16"
  };
  return routes[score] ? `Suggested: ${routes[score]}` : "Custom finish required.";
}

// ------------------------------
// WINNER HANDLING
// ------------------------------
function announceWinner() {
  const modal = document.getElementById("winnerModal");
  document.getElementById("winnerMessage").innerText = 
    `🎯 Congratulations ${players[currentPlayer].name}! Sharp shooter!`;
  modal.classList.remove("hidden");
}

function nextLeg() {
  players.forEach(p => p.score = 501);
  turnScores = [];
  currentDart = 0;
  document.getElementById("winnerModal").classList.add("hidden");
  updateDisplay();
}

function newMatch() {
  location.reload();
}

// ------------------------------
// BUST ALERT
// ------------------------------
function showBust() {
  const glowBox = document.querySelectorAll(".player-score")[currentPlayer];
  glowBox.style.backgroundColor = "#ffdddd";
  setTimeout(() => (glowBox.style.backgroundColor = ""), 600);
}