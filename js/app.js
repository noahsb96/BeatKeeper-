let sequence = [];
let humanSequence = [];
let level = 0;

const startButton = document.querySelector('.js-start');
const info = document.querySelector('.js-info');

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
    level += 1;
    const nextSequence = [...sequence];
    nextSequence.push(nextStep());
    playRound(nextSequence);
}

function startGame() {
  startButton.classList.add('hidden');
  info.classList.remove('hidden');
  info.textContent = 'Wait for the computer';
  nextRound();
}

startButton.addEventListener('click', startGame);