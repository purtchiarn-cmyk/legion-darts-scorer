// ----- VARIABLES -----
let activePlayer = 0;
const players = [
  { name: "Home (P1)", score: 501, darts: [], totalDarts: 0 },
  { name: "Away (P2)", score: 501, darts: [], totalDarts: 0 }
];
let multiplier = 1;
let showCheckout = false;

// ----- INIT -----
function initGame() {
  updateUI();
}

// ----- UI UPDATES -----
function updateUI() {
  document.querySelectorAll(".player").forEach((el, i) => {
    const player = players[i];
    el.querySelector(".player-score").innerText = player.score;
    el.querySelector(".player-3da").innerText =
      player.totalDarts > 0
        ? `3DA: ${( (501 - player.score) / player.totalDarts * 3).toFixed(1)}`
        : "3DA: 0.0";
    el.classList.toggle("active", i === activePlayer);
  });
}

// ----- BUTTON PRESSES -----
function pressMultiplier(type) {
  document.querySelectorAll(".multi-btn").forEach(b => b.classList.remove("glow"));
  multiplier = type === "D" ? 2 : type === "T" ? 3 : 1;
  const btn = document.getElementById(type);
  if (btn) btn.classList.add("glow");
}

function pressNumber(n) {
  const player = players[activePlayer];
  const dartScore = n * multiplier;
  player.darts.push(dartScore);
  player.totalDarts++;

  player.score -= dartScore;
  if (player.score < 0) player.score += dartScore; // bust logic

  if (player.score === 0) {
    alert(`🎯 Congratulations sharpshooter! ${player.name} wins!`);
  }

  multiplier = 1;
  document.querySelectorAll(".multi-btn").forEach(b => b.classList.remove("glow"));
  updateUI();
}

function undoLastDart() {
  const player = players[activePlayer];
  if (player.darts.length > 0) {
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

// ----- MODAL HANDLING -----
const modal = document.getElementById("checkoutModal");
const modalContent = document.getElementById("checkoutContent");

function toggleCheckout() {
  const score = players[activePlayer].score;
  if (modal.style.display === "flex") {
    modal.style.display = "none";
    return;
  }

  let content = "";
  if (score > 170) {
    content = "No checkout available";
  } else {
    content = getCheckoutCombinations(score);
  }

  modalContent.innerHTML = `<h2>Checkout for ${score}</h2><p>${content}</p>`;
  modal.style.display = "flex";

  setTimeout(() => (modal.style.display = "none"), 4000);
}

function getCheckoutCombinations(score) {
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
    143: "T20 T17 D16",
    142: "T20 T14 D20",
    141: "T20 T19 D12",
    140: "T20 T20 D10"
  };
  return checkouts[score] || "No standard finish";
}

// ----- TOOLTIP -----
const tooltip = document.getElementById("tooltip");
document.querySelector(".checkout-icon").addEventListener("mouseenter", e => {
  tooltip.innerText = "Suggested checkout routes";
  tooltip.style.display = "block";
  tooltip.style.top = e.clientY - 40 + "px";
  tooltip.style.left = e.clientX - 60 + "px";
});
document.querySelector(".checkout-icon").addEventListener("mouseleave", () => {
  tooltip.style.display = "none";
});