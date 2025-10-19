// === Legion Darts Scorer v3.1 ===

// Game state
let scores = [501, 501];
let currentPlayer = 0;
let dartsThisTurn = [];
let totalDarts = [0, 0];
let totalScored = [0, 0];
let first9Scored = [0, 0];
let doubleActive = false;
let trebleActive = false;
let darkMode = false;

// Element references
const scoreEls = [document.getElementById("score1"), document.getElementById("score2")];
const avgEls = [document.getElementById("avg1"), document.getElementById("avg2")];
const dartsEls = [document.getElementById("darts1"), document.getElementById("darts2")];
const tooltip = document.getElementById("tooltip");

function updateDisplay() {
  for (let i = 0; i < 2; i++) {
    scoreEls[i].textContent = scores[i];
    let darts = totalDarts[i] || 1;
    let avg = totalScored[i] / (darts / 3);
    avgEls[i].textContent = `3DA: ${isNaN(avg) ? "0.00" : avg.toFixed(2)}`;
  }

  // Player highlighting
  document.getElementById("p1").style.background =
    currentPlayer === 0 ? "var(--highlight)" : "rgba(255,255,255,0.7)";
  document.getElementById("p2").style.background =
    currentPlayer === 1 ? "var(--highlight)" : "rgba(255,255,255,0.7)";
}

// Add a dart score
function addScore(val) {
  if (dartsThisTurn.length >= 3) return;

  let displayVal = val;
  let scoreVal = val;

  if (doubleActive) {
    scoreVal = val * 2;
    displayVal = `D${val}`;
    doubleActive = false;
    document.getElementById("doubleBtn").classList.remove("active");
  } else if (trebleActive) {
    scoreVal = val * 3;
    displayVal = `T${val}`;
    trebleActive = false;
    document.getElementById("trebleBtn").classList.remove("active");
  }

  dartsThisTurn.push(scoreVal);
  updateDartsDisplay(displayVal, scoreVal);
}

// Update dart-by-dart UI
function updateDartsDisplay(displayVal, scoreVal) {
  let dartText = `Dart ${dartsThisTurn.length}: ${displayVal} (${scoreVal})`;
  dartsEls[currentPlayer].innerHTML += dartText + "<br>";
}

// Undo last dart
function undoDart() {
  dartsThisTurn.pop();
  const lines = dartsEls[currentPlayer].innerHTML.split("<br>");
  lines.pop();
  dartsEls[currentPlayer].innerHTML = lines.join("<br>");
}

// Undo full turn
function undoTurn() {
  if (totalDarts[currentPlayer] >= 3) totalDarts[currentPlayer] -= 3;
  dartsThisTurn = [];
  dartsEls[currentPlayer].innerHTML = "";
  updateDisplay();
}

// Submit a full turn
function submitTurn() {
  let total = dartsThisTurn.reduce((a, b) => a + b, 0);
  if (total > scores[currentPlayer]) {
    bustTurn();
    return;
  }

  scores[currentPlayer] -= total;
  totalScored[currentPlayer] += total;
  totalDarts[currentPlayer] += dartsThisTurn.length;

  if (totalDarts[currentPlayer] <= 9) first9Scored[currentPlayer] += total;

  dartsThisTurn = [];
  dartsEls[currentPlayer].innerHTML = "";

  if (scores[currentPlayer] === 0) {
    alert(`🏆 Congratulations Sharp Shooter!\nPlayer ${currentPlayer + 1} wins!`);
    resetGame();
    return;
  }

  currentPlayer = 1 - currentPlayer;
  updateDisplay();
}

// Bust turn
function bustTurn() {
  dartsThisTurn = [];
  dartsEls[currentPlayer].innerHTML = "";
  currentPlayer = 1 - currentPlayer;
  updateDisplay();
}

// Reset game
function resetGame() {
  scores = [501, 501];
  currentPlayer = 0;
  dartsThisTurn = [];
  totalDarts = [0, 0];
  totalScored = [0, 0];
  first9Scored = [0, 0];
  dartsEls.forEach(el => el.innerHTML = "");
  updateDisplay();
}

// Tooltip
function showTooltip(text, el) {
  tooltip.textContent = text;
  const rect = el.getBoundingClientRect();
  tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + "px";
  tooltip.style.top = rect.top - 30 + "px";
  tooltip.classList.add("show");
  setTimeout(() => tooltip.classList.remove("show"), 1500);
}

// Dark mode toggle
document.querySelector(".dark-toggle").addEventListener("click", () => {
  darkMode = !darkMode;
  document.body.classList.toggle("dark");
});

// Modals
function closeModal(id) {
  document.getElementById(id).classList.remove("active");
}

// Show Checkout
document.getElementById("checkoutBtn").addEventListener("click", () => {
  document.getElementById("checkoutModal").classList.add("active");
});

// 3 Dart Scorer
document.getElementById("threeDartBtn").addEventListener("click", () => {
  document.getElementById("threeDartModal").classList.add("active");
});
function applyThreeDart() {
  const val = parseInt(document.getElementById("threeDartInput").value);
  if (!isNaN(val)) {
    dartsThisTurn = [val];
    submitTurn();
  }
  closeModal("threeDartModal");
}

// Stats
document.getElementById("statsBtn").addEventListener("click", () => {
  let html = "";
  for (let i = 0; i < 2; i++) {
    const avg = (totalScored[i] / (totalDarts[i] / 3)) || 0;
    html += `<p><strong>${i === 0 ? "Home" : "Away"}</strong> – 3DA: ${avg.toFixed(2)}, Darts: ${totalDarts[i]}</p>`;
  }
  document.getElementById("statsContent").innerHTML = html;
  document.getElementById("statsModal").classList.add("active");
});

// Keypad
const numbers = document.querySelector(".numbers");
for (let i = 1; i <= 20; i++) {
  const btn = document.createElement("button");
  btn.textContent = i;
  btn.onclick = () => addScore(i);
  numbers.appendChild(btn);
}

// 25, Bull, No Score
document.getElementById("btn25").onclick = () => addScore(25);
document.getElementById("btnBull").onclick = () => addScore(50);
document.getElementById("btnNoScore").onclick = () => addScore(0);

// D/T activation with glow
document.getElementById("doubleBtn").onclick = (e) => {
  doubleActive = !doubleActive;
  trebleActive = false;
  e.target.classList.toggle("active", doubleActive);
  document.getElementById("trebleBtn").classList.remove("active");
  showTooltip("Double active", e.target);
};
document.getElementById("trebleBtn").onclick = (e) => {
  trebleActive = !trebleActive;
  doubleActive = false;
  e.target.classList.toggle("active", trebleActive);
  document.getElementById("doubleBtn").classList.remove("active");
  showTooltip("Treble active", e.target);
};

// Control buttons
document.getElementById("submitTurn").addEventListener("click", submitTurn);
document.getElementById("undoDart").addEventListener("click", undoDart);
document.getElementById("undoTurn").addEventListener("click", undoTurn);
document.getElementById("coinPlaceholder").addEventListener("click", (e) => showTooltip("Coin flip placeholder", e.target));
document.getElementById("coinPlaceholderBottom").addEventListener("click", (e) => showTooltip("Coin flip placeholder", e.target));

updateDisplay();
