let sequence = [];
let humanSequence = [];

const startButton = document.querySelector('.js-start');
const info = document.querySelector('.js-info');

function startGame() {
    startButton.classList.add('hidden');
    info.classList.remove('hidden');
    info.textContent = 'Wait for the computer';
    nextRound();
}

let level = 0;

function activateDrums(skins) {
    const drum = document.querySelector(`[data-drum='${skins}']`);
    const sound = document.querySelector(`[data-sound='${skins}']`);
  
    drum.classList.add('activated');
    sound.play();
  
    setTimeout(() => {
      drum.classList.remove('activated');
    }, 300);
  }
  
function playRound(nextSequence) {
    nextSequence.forEach((skins, index) => {
      setTimeout(() => {
        activateTile(skins);
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