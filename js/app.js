let sequence = [];
let humanSequence = [];
let level = 0;

const startButton = document.querySelector('.js-start');
const info = document.querySelector('.js-info');
const heading = document.querySelector('.js-heading');
const drumContainer = document.querySelector('.js-container');

function resetGame(text) {
  alert(text);
  sequence = [];
  humanSequence = [];
  level = 0;
  startButton.classList.remove('hidden');
  heading.textContent = 'BeatKeeper';
  info.classList.add('hidden');
  drumContainer.classList.add('unclickable');
}

function humanTurn(level) {
  drumContainer.classList.remove('unclickable');
  info.textContent = `Your turn: ${level} Tap${level > 1 ? 's' : ''}`;
}

function activateDrum(button) {
  const drum = document.querySelector(`[data-drum='${button}']`);
  const sound = document.querySelector(`[data-sound='${button}']`);

  drum.classList.add('activated');
  sound.play();

  setTimeout(() => {
    drum.classList.remove('activated');
  }, 300);
}
  
function playRound(nextSequence) {
    nextSequence.forEach((button, index) => {
      setTimeout(() => {
        activateDrum(button);
      }, (index + 1) * 600);
    });
}

function nextStep() {
    const drums = ['Kick', 'HiHat', 'Snare', 'Crash1', 'RackTom', 'Crash2', 'FloorTom', 'Ride'];
    const random = drums[Math.floor(Math.random() * drums.length)];
    return random;
}

function nextRound() {
  drumContainer.classList.add('unclickable');
  info.textContent = 'Wait for the computer';
  heading.textContent = `Level ${level} of 20`;
  level += 1;
  const nextSequence = [...sequence];
  nextSequence.push(nextStep());
  playRound(nextSequence);
  sequence = [...nextSequence];
  setTimeout(() => {
    humanTurn(level);
  }, level * 600 + 1000);
}

function handleClick(drum) {
  const index = humanSequence.push(drum) - 1;
  const sound = document.querySelector(`[data-sound='${drum}']`);
  sound.play();
  const remainingTaps = sequence.length - humanSequence.length;
  if (humanSequence[index] !== sequence[index]) {
    resetGame('Oops! Game over, you pressed the wrong tile');
    return;
  }
  if (humanSequence.length === sequence.length) {
    if (humanSequence.length === 20) {
      resetGame('Congrats! You completed all the levels');
      return
    }

    humanSequence = [];
    info.textContent = 'Success! Keep going!';
    setTimeout(() => {
      nextRound();
    }, 1000);
    return;
  }

  info.textContent = `Your turn: ${remainingTaps} Tap${
    remainingTaps > 1 ? 's' : ''
  }`;
}

function startGame() {
  startButton.classList.add('hidden');
  info.classList.remove('hidden');
  info.textContent = 'Wait for the computer';
  nextRound();
}

startButton.addEventListener('click', startGame);
drumContainer.addEventListener('click', event => {
  const { drum } = event.target.dataset;

  if (drum) handleClick(drum);
});