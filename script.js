/* ===== LEGION DARTS SCORER v2.3.1 SCRIPT ===== */

// --- Game State ---
let players = [
  { name: "Home", score: 501, darts: 0, totalScore: 0, avg: 0 },
  { name: "Away", score: 501, darts: 0, totalScore: 0, avg: 0 }
];
let activePlayer = 0;
let currentTurn = [];
let modifier = "";
let legHistory = [];

// --- DOM Shortcuts ---
const numpad = document.getElementById("numpad");
const statsModal = document.getElementById("statsModal");
const statsContent = document.getElementById("statsContent");
const checkoutModal = document.getElementById("checkoutModal");
const checkoutContent = document.getElementById("checkoutContent");

// --- Setup ---
window.addEventListener("load", () => {
  generateNumpad();
  loadNames();
});

// --- Start Match ---
function startMatch() {
  const homeName = document.getElementById('homeName').value || "Home";
  const awayName = document.getElementById('awayName').value || "Away";
  const bullWinner = parseInt(document.getElementById('bullWinner').value);

  players[0].name = homeName;
  players[1].name = awayName;
  saveNames(homeName, awayName);

  activePlayer = bullWinner;
  updateUI();

  document.getElementById('start-screen').classList.remove("active");
  document.getElementById('start-screen').classList.add("hidden");
  document.getElementById('game-screen').classList.remove("hidden");
}

// --- Numpad Creation ---
function generateNumpad() {
  for (let i = 1; i <= 20; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.onclick = () => addScore(i);
    numpad.appendChild(btn);
  }
}

// --- Load & Save Names ---
function saveNames(home, away) {
  localStorage.setItem("homeName", home);
  localStorage.setItem("awayName", away);
}
function loadNames() {
  const home = localStorage.getItem("homeName");
  const away = localStorage.getItem("awayName");
  if (home) document.getElementById("homeName").value = home;
  if (away) document.getElementById("awayName").value = away;
}

// --- Modifiers ---
function setModifier(m) {
  modifier = (modifier === m) ? "" : m;
  document.getElementById("doubleBtn").style.background = (modifier === "D") ? "#1565c0" : "";
  document.getElementById("tripleBtn").style.background = (modifier === "T") ? "#1565c0" : "";
}

// --- Add Score ---
function addScore(base) {
  if (currentTurn.length >= 3) return;
  let score = base;
  if (modifier === "D") score = base * 2;
  if (modifier === "T") score = base * 3;
  modifier = "";
  setModifier(""); // reset buttons
  currentTurn.push(score);
  updateDartDisplay();
}

// --- Undo / Turn Control ---
function undoDart() {
  currentTurn.pop();
  updateDartDisplay();
}
function undoTurn() {
  if (legHistory.length > 0) {
    const last = legHistory.pop();
    players = last.players;
    activePlayer = last.activePlayer;
    updateUI();
  }
}
function submitTurn() {
  const total = currentTurn.reduce((a,b)=>a+b,0);
  const p = players[activePlayer];

  legHistory.push({
    players: JSON.parse(JSON.stringify(players)),
    activePlayer
  });

  p.darts += currentTurn.length;
  p.totalScore += total;
  p.score -= total;

  if (p.score < 0) { // bust
    p.score += total;
  } else if (p.score === 0) {
    alert(`🎉 ${p.name} wins the leg! Sharp shooter!`);
    p.score = 501;
    players[1 - activePlayer].score = 501;
    p.darts = 0;
    players[1 - activePlayer].darts = 0;
  }

  p.avg = p.darts ? ((p.totalScore / p.darts) * 3).toFixed(2) : "0.00";

  currentTurn = [];
  updateDartDisplay();
  activePlayer = 1 - activePlayer;
  updateUI();
}

// --- UI Update ---
function updateUI() {
  players.forEach((p, i) => {
    document.querySelector(`#player${i} .player-name`).innerText = p.name;
    document.querySelector(`#player${i} .player-score`).innerText = p.score;
    document.querySelector(`#player${i} .player-avg`).innerText = `3DA: ${p.avg}`;
  });

  document.querySelectorAll(".player").forEach((el, idx)=>{
    el.classList.toggle("active", idx === activePlayer);
    if (idx === activePlayer) {
      el.classList.add("glow");
      setTimeout(()=>el.classList.remove("glow"), 600);
    }
  });
}

// --- Dart Display ---
function updateDartDisplay() {
  for (let i=1;i<=3;i++){
    document.getElementById(`dart${i}`).innerText = currentTurn[i-1] ?? "–";
  }
}

// --- Stats Modal ---
function toggleStats() {
  if (statsModal.classList.contains("hidden")) {
    let html = "";
    players.forEach(p=>{
      html += `<p><strong>${p.name}</strong><br>
      Score: ${p.score}<br>
      Darts Thrown: ${p.darts}<br>
      3DA: ${p.avg}</p>`;
    });
    statsContent.innerHTML = html;
  }
  statsModal.classList.toggle("hidden");
}

// --- Checkout Modal ---
function toggleCheckout() {
  if (checkoutModal.classList.contains("hidden")) {
    const score = players[activePlayer].score;
    checkoutContent.innerHTML = buildCheckoutText(score);
  }
  checkoutModal.classList.toggle("hidden");
}

function buildCheckoutText(score) {
  if (score > 170) return `<p>No checkout available above 170.</p>`;
  const table = {
    170: "T20 T20 Bull",
    167: "T20 T19 Bull",
    164: "T20 T18 Bull",
    161: "T20 T17 Bull",
    160: "T20 T20 D20",
    158: "T20 T20 D19",
    157: "T20 T19 D20",
    156: "T20 T20 D18",
    155: "T20 T19 D19",
    154: "T20 T18 D20",
    153: "T20 T19 D18",
    152: "T20 T20 D16",
    151: "T20 T17 D20",
    150: "T20 T18 D18",
    149: "T20 T19 D16",
    148: "T20 T16 D20",
    147: "T20 T17 D18",
    146: "T20 T18 D16",
    145: "T20 T15 D20",
    144: "T20 T20 D12",
    141: "T20 T19 D12",
    140: "T20 T20 D10",
    138: "T20 T18 D12",
    137: "T19 T16 D16",
    136: "T20 T20 D8",
    132: "Bull Bull D16",
    130: "T20 T20 D5",
    129: "T19 T16 D12",
    128: "T18 T14 D16",
    127: "T20 T17 D8",
    126: "T19 T19 D6",
    125: "25 T20 D20",
    124: "T20 T16 D8",
    121: "T20 T11 D14",
    120: "T20 20 D20",
    119: "T19 T10 D16",
    118: "T20 18 D20",
    117: "T20 17 D20",
    116: "T20 16 D20",
    115: "T20 15 D20",
    114: "T20 14 D20",
    113: "T20 13 D20",
    112: "T20 12 D20",
    111: "T20 11 D20",
    110: "T20 10 D20",
    109: "T20 9 D20",
    108: "T20 8 D20",
    107: "T20 7 D20",
    106: "T20 6 D20",
    105: "T20 5 D20",
    104: "T18 18 D16",
    103: "T20 3 D20",
    102: "T20 10 D16",
    101: "T17 10 D20",
    100: "T20 D20"
  };
  return `<p>${table[score] || "No exact checkout known for this score."}</p>`;
}