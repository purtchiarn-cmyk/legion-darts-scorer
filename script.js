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
// === Checkout Logic ===
const checkoutTable = {
  170: "T20, T20, Bull",
  167: "T20, T19, Bull",
  164: "T20, T18, Bull",
  161: "T20, T17, Bull",
  160: "T20, T20, D20",
  158: "T20, T20, D19",
  157: "T20, T19, D20",
  156: "T20, T20, D18",
  155: "T20, T19, D19",
  154: "T20, T18, D20",
  153: "T20, T19, D18",
  152: "T20, T20, D16",
  151: "T20, T17, D20",
  150: "T20, T18, D18",
  149: "T20, T19, D16",
  148: "T20, T16, D20",
  147: "T20, T17, D18",
  146: "T20, T18, D16",
  145: "T20, T15, D20",
  144: "T20, T20, D12",
  143: "T20, T17, D16",
  142: "T20, T14, D20",
  141: "T20, T19, D12",
  140: "T20, T20, D10",
  139: "T19, T14, D20",
  138: "T20, T18, D12",
  137: "T19, T16, D16",
  136: "T20, T20, D8",
  135: "Bull, T15, D20",
  134: "T20, T14, D16",
  133: "T20, T19, D8",
  132: "Bull, Bull, D16",
  131: "T20, T13, D16",
  130: "T20, T18, D8",
  129: "T19, T16, D12",
  128: "T18, T14, D16",
  127: "T20, T17, D8",
  126: "T19, T19, D6",
  125: "Bull, T20, D8",
  124: "T20, T16, D8",
  123: "T19, T10, D18",
  122: "T18, T20, D4",
  121: "T20, T11, D14",
  120: "T20, 20, D20",
  119: "T19, T10, D16",
  118: "T20, 18, D20",
  117: "T20, 17, D20",
  116: "T19, 19, D20",
  115: "T20, 15, D20",
  114: "T20, 14, D20",
  113: "T20, 13, D20",
  112: "T20, 12, D20",
  111: "T20, 11, D20",
  110: "T20, 10, D20",
  109: "T20, 9, D20",
  108: "T20, 8, D20",
  107: "T20, 7, D20",
  106: "T20, 6, D20",
  105: "T20, 5, D20",
  104: "T18, 18, D16",
  103: "T20, 3, D20",
  102: "T20, 10, D16",
  101: "T17, 10, D20",
  100: "T20, D20",
  99: "T19, 10, D16",
  98: "T20, D19",
  97: "T19, D20",
  96: "T20, D18",
  95: "T19, D19",
  94: "T18, D20",
  93: "T19, D18",
  92: "T20, D16",
  91: "T17, D20",
  90: "T20, D15",
  89: "T19, D16",
  88: "T16, D20",
  87: "T17, D18",
  86: "T18, D16",
  85: "T15, D20",
  84: "T20, D12",
  83: "T17, D16",
  82: "Bull, D16",
  81: "T19, D12",
  80: "T20, D10",
  79: "T19, D11",
  78: "T18, D12",
  77: "T19, D10",
  76: "T20, D8",
  75: "T17, D12",
  74: "T14, D16",
  73: "T19, D8",
  72: "T16, D12",
  71: "T13, D16",
  70: "T18, D8",
  69: "T19, D6",
  68: "T20, D4",
  67: "T17, D8",
  66: "T10, D18",
  65: "T11, D16",
  64: "T16, D8",
  63: "T13, D12",
  62: "T10, D16",
  61: "T15, D8",
  60: "20, D20",
  59: "19, D20",
  58: "18, D20",
  57: "17, D20",
  56: "16, D20",
  55: "15, D20",
  54: "14, D20",
  53: "13, D20",
  52: "12, D20",
  51: "11, D20",
  50: "10, D20",
  49: "9, D20",
  48: "8, D20",
  47: "7, D20",
  46: "6, D20",
  45: "13, D16",
  44: "12, D16",
  43: "11, D16",
  42: "10, D16",
  41: "9, D16",
  40: "D20",
  39: "7, D16",
  38: "D19",
  37: "5, D16",
  36: "D18",
  35: "3, D16",
  34: "D17",
  33: "1, D16",
  32: "D16",
  31: "15, D8",
  30: "D15",
  29: "13, D8",
  28: "D14",
  27: "11, D8",
  26: "D13",
  25: "9, D8",
  24: "D12",
  23: "7, D8",
  22: "D11",
  21: "5, D8",
  20: "D10",
  19: "3, D8",
  18: "D9",
  17: "1, D8",
  16: "D8",
  15: "7, D4",
  14: "D7",
  13: "5, D4",
  12: "D6",
  11: "3, D4",
  10: "D5",
  9: "1, D4",
  8: "D4",
  7: "3, D2",
  6: "D3",
  5: "1, D2",
  4: "D2",
  2: "D1"
};

document.getElementById("checkoutBtn").addEventListener("click", () => {
  const score = scores[currentPlayer];
  let message = score <= 170 && checkoutTable[score]
    ? `${score} → ${checkoutTable[score]}`
    : "No checkout available";
  document.getElementById("checkoutContent").innerHTML = `<p>${message}</p>`;
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