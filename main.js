// ---------- DARK MODE ----------
document.getElementById('darkToggle').onclick = () => {
  document.body.classList.toggle('dark');
  darkToggle.textContent = document.body.classList.contains('dark') ? '🌙' : '☀️';
};

// ---------- GAME STATE ----------
let matchState = {
  legsToWin: 2,
  legsWon: [0, 0],
  currentLeg: 1,
  scores: [501, 501],
  currentDarts: [[], []],
  allDarts: [[], []],
  active: 0,
  legHistory: []
};

const scoreEls = [document.getElementById('score1'), document.getElementById('score2')];
const dartEls = [document.getElementById('darts1'), document.getElementById('darts2')];
const avgEls = [document.getElementById('avg1'), document.getElementById('avg2')];
const checkoutEls = [document.getElementById('checkout1'), document.getElementById('checkout2')];
const msg = document.getElementById('message');

// ---------- START GAME ----------
document.getElementById('startGame').onclick = () => {
  const homeName = document.getElementById('homeName').value || 'Home';
  const awayName = document.getElementById('awayName').value || 'Away';
  matchState.legsToWin = parseInt(document.getElementById('bestOf').value);
  document.querySelector('#home h2').textContent = `${homeName} (P1)`;
  document.querySelector('#away h2').textContent = `${awayName} (P2)`;
  document.getElementById('startScreen').style.opacity = '0';
  setTimeout(() => {
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('gameScreen').style.display = 'block';
    document.getElementById('gameScreen').style.opacity = '1';
  }, 500);
};

// ---------- UTILS ----------
function showMessage(text) {
  msg.textContent = text;
  msg.style.display = 'block';
  setTimeout(() => msg.style.display = 'none', 1500);
}

function updateDarts() {
  for (let i = 0; i < 2; i++) {
    const dset = dartEls[i].querySelectorAll('.dart');
    dset.forEach((d, j) => {
      d.textContent = matchState.currentDarts[i][j] !== undefined ? matchState.currentDarts[i][j] : '–';
      d.classList.toggle('empty', matchState.currentDarts[i][j] === undefined);
    });
  }
}

function switchPlayer() {
  document.getElementById('home').classList.toggle('active');
  document.getElementById('away').classList.toggle('active');
  matchState.active = 1 - matchState.active;
}

function calcStats(i) {
  const darts = matchState.allDarts[i];
  if (!darts.length) return '3DA: 0.00';
  const total = darts.reduce((a, b) => a + b, 0);
  const avg = (total / darts.length * 3).toFixed(2);
  const highest = Math.max(...darts.map((_, idx) => {
    if (idx % 3 !== 0) return 0;
    return darts.slice(idx, idx + 3).reduce((a, b) => a + b, 0);
  }));
  return `3DA: ${avg} | Darts: ${darts.length} | Total: ${total} | High: ${highest}`;
}

function updateCheckout(i) {
  const score = matchState.scores[i];
  const table = {
    170: 'T20 T20 Bull', 167: 'T20 T19 Bull', 164: 'T20 T18 Bull',
    161: 'T20 T17 Bull', 160: 'T20 T20 D20', 158: 'T20 T20 D19',
    157: 'T20 T19 D20', 156: 'T20 T20 D18', 155: 'T20 T19 D19',
    154: 'T20 T18 D20', 153: 'T20 T19 D18', 152: 'T20 T20 D16',
    151: 'T20 T17 D20', 150: 'T20 T18 D18', 149: 'T20 T19 D16',
    148: 'T20 T16 D20', 147: 'T20 T17 D18', 146: 'T20 T18 D16',
    145: 'T20 T15 D20', 144: 'T20 T20 D12', 143: 'T20 T17 D16',
    142: 'T20 T14 D20', 141: 'T20 T19 D12', 140: 'T20 T20 D10'
  };
  checkoutEls[i].textContent = score <= 170 && score >= 2 && table[score] ? `Finish: ${table[score]}` : '';
}

// ---------- INPUT HANDLING ----------
let multiplier = null;

document.getElementById('keypad').addEventListener('click', e => {
  if (e.target.tagName !== 'BUTTON') return;
  const act = e.target.dataset.action;
  if (act === 'D' || act === 'T') {
    multiplier = act;
    return;
  }

  let val = 0;
  if (act === '25') val = 25;
  else if (act === 'BULL') val = 50;
  else if (act === 'NS') val = 0;
  else val = parseInt(e.target.textContent);

  if ((val >= 1 && val <= 20) && multiplier === 'D') val *= 2;
  else if ((val >= 1 && val <= 20) && multiplier === 'T') val *= 3;
  multiplier = null;

  if (matchState.currentDarts[matchState.active].length < 3) {
    matchState.currentDarts[matchState.active].push(val);
    updateDarts();
  }
});

// ---------- UNDO ----------
document.getElementById('undoDart').onclick = () => {
  matchState.currentDarts[matchState.active].pop();
  updateDarts();
};

document.getElementById('undoTurn').onclick = () => {
  matchState.currentDarts[matchState.active] = [];
  updateDarts();
};

document.getElementById('undoLast').onclick = () => {
  switchPlayer();
  const lastTurn = matchState.allDarts[matchState.active].splice(-3);
  const restored = lastTurn.reduce((a, b) => a + b, 0);
  matchState.scores[matchState.active] += restored;
  scoreEls[matchState.active].textContent = matchState.scores[matchState.active];
  avgEls[matchState.active].textContent = calcStats(matchState.active);
  updateCheckout(matchState.active);
  matchState.currentDarts[matchState.active] = [];
  updateDarts();
  showMessage('Previous turn undone');
};

// ---------- SUBMIT TURN ----------
document.getElementById('submitTurn').onclick = () => {
  const sum = matchState.currentDarts[matchState.active].reduce((a, b) => a + b, 0);
  const newScore = matchState.scores[matchState.active] - sum;

  if (newScore < 0) {
    showMessage('BUST!');
    matchState.currentDarts[matchState.active] = [];
    updateDarts();
    switchPlayer();
    return;
  }

  matchState.scores[matchState.active] = newScore;
  scoreEls[matchState.active].textContent = newScore;
  matchState.allDarts[matchState.active].push(...matchState.currentDarts[matchState.active]);
  avgEls[matchState.active].textContent = calcStats(matchState.active);
  updateCheckout(matchState.active);
  matchState.currentDarts[matchState.active] = [];
  updateDarts();

  if (newScore === 0) {
    matchState.legsWon[matchState.active]++;
    matchState.legHistory.push({
      leg: matchState.currentLeg,
      winner: matchState.active,
      darts: [...matchState.allDarts[matchState.active]]
    });

    if (matchState.legsWon[matchState.active] > matchState.legsToWin / 2) {
      showMessage(`🏆 ${matchState.active === 0 ? 'Home' : 'Away'} wins the match!`);
      // Optionally disable input or reset
    } else {
      showMessage(`Leg ${matchState.currentLeg} won!`);
      matchState.currentLeg++;
      matchState.scores = [501, 501];
      matchState.allDarts = [[], []];
      matchState.currentDarts = [[], []];
      scoreEls[0].textContent = 501;
      scoreEls[1].textContent = 501;
      avgEls[0].textContent = '
