let activePlayer = 0;
let multiplier = 1;

const players = [
  { name: "Home (P1)", score: 501, darts: [], totalDarts: 0 },
  { name: "Away (P2)", score: 501, darts: [], totalDarts: 0 }
];

// --- Start Match ---
document.getElementById("startButton").addEventListener("click", () => {
  const home = document.getElementById("homeName").value || "Home (P1)";
  const away = document.getElementById("awayName").value || "Away (P2)";
  const bullWinner = parseInt(document.getElementById("bullWinner").value);

  players[0].name = home;
  players[1].name = away;
  activePlayer = bullWinner;

  document.querySelector("#player0 .player-name").innerText = home;
  document.querySelector("#player1 .player-name").innerText = away;

  document.getElementById("start-screen").style.display = "none";
  document.getElementById("game-screen").style.display = "block";
  updateUI();
});

function updateUI() {
  players.forEach((p, i) => {
    const el = document.getElementById(`player${i}`);
    el.querySelector(".player-score").innerText = p.score;
    const avg = p.totalDarts > 0 ? ((501 - p.score) / p.totalDarts * 3).toFixed(1) : "0.0";
    el.querySelector(".player-3da").innerText = `3DA: ${avg}`;
    el.classList.toggle("active", i === activePlayer);
  });
}

function pressMultiplier(type) {
  document.querySelectorAll(".multi-btn").forEach(b => b.classList.remove("glow"));
  multiplier = type === "D" ? 2 : type === "T" ? 3 : 1;
  const btn = document.getElementById(type);
  if (btn) btn.classList.add("glow");
}

function pressNumber(n) {
  const player = players[activePlayer];
  const dart = n * multiplier;
  const prevScore = player.score;
  player.score -= dart;

  if (player.score < 0) {
    player.score = prevScore; // bust
  } else {
    player.darts.push(dart);
    player.totalDarts++;
    if (player.score === 0) {
      alert(`🎯 Sharp shooter! ${player.name} wins!`);
    }
  }

  multiplier = 1;
  document.querySelectorAll(".multi-btn").forEach(b => b.classList.remove("glow"));
  updateUI();
}

function undoLastDart() {
  const player = players[activePlayer];
  if (player.darts.length) {
    const last = player.darts.pop();
    player.score += last;
    player.totalDarts--;
    updateUI();
  }
}

function nextPlayer() {
  activePlayer = activePlayer === 0 ? 1 : 0;
  updateUI();
}

// --- Checkout Modal ---
const modal = document.getElementById("checkoutModal");
const modalContent = document.getElementById("checkoutContent");

function toggleCheckout() {
  const score = players[activePlayer].score;
  let content = "";
  if (score > 170) content = "No checkout available";
  else content = getCheckout(score);
  modalContent.innerHTML = `<h2>Checkout for ${score}</h2><p>${content}</p>`;
  modal.style.display = "flex";
  setTimeout(() => modal.style.display = "none", 4000);
}

function getCheckout(score) {
  const checkouts = {
    170: "T20 T20 Bull",
    167: "T20 T19 Bull",
    164: "T20 T18 Bull",
    161: "T20 T17 Bull",
    160: "T20 T20 D20",
    158: "T20 T20 D19",
    157: "T20 T19 D20",
    156: "T20 T20 D18",
    155: "T20 T19 D19",
    154: "T20 T18 D20"
  };
  return checkouts[score] || "No standard finish";
}

// --- Tooltip ---
const tooltip = document.getElementById("tooltip");
const checkoutIcon = document.querySelector(".checkout-icon");

checkoutIcon.addEventListener("mouseenter", e => {
  tooltip.innerText = "Suggested checkout routes";
  tooltip.style.display = "block";
  tooltip.style.top = e.clientY - 40 + "px";
  tooltip.style.left = e.clientX - 60 + "px";
});
checkoutIcon.addEventListener("mouseleave", () => tooltip.style.display = "none");

function showStats() {
  alert("📊 Stats coming soon!");
}