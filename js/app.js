let sequence = []; // array that keeps track of original sequence of clicks
let humanSequence = []; // array that keeps track of the human sequence of clicks
let level = 0; // level variable will keep track of the number of rounds that have been played so far

const startButton = document.querySelector('.js-start'); // selects the start button on the page
const info = document.querySelector('.js-info'); // selects the info element that displays status messages of the game
const heading = document.querySelector('.js-heading'); // selects the heading element on the HTML 
const drumContainer = document.querySelector('.js-container'); // selects the element that contains all the buttons on the page

function resetGame(text) { // creating function that resets the game and restores it to orginal state
  alert(text); // displays an alert that contains text. Text is defined in handle click function in if statement
  sequence = []; // sequence array reset
  humanSequence = []; // human sequence array reset
  level = 0; // level reset
  startButton.classList.remove('hidden'); // start button is no longer hidden so the player can start the game again
  heading.textContent = 'BeatKeeper'; // heading element is reset to display the name of the game
  info.classList.add('hidden'); // info element is hidden again
  drumContainer.classList.add('unclickable'); // the container for all the drums are unclickable again
}

function humanTurn(level) { // function that indicates that the computer is finished with the round and it's time for the player to repeat the sequence
  drumContainer.classList.remove('unclickable'); // removes the unclickable class from the container. This class prevents the buttons from being pressed when the game has not started and when the AI is not finished with the sequence of presses
  info.textContent = `Your turn: ${level} Tap${level > 1 ? 's' : ''}`; // the contents of the info element is changed to indicate that the player can begin to repeat the sequence. Also shows how many taps needs to be entered. Question mark in string interpolation marks a condition. If the level is more than one, it will ad an S to Tap. If it's false, it won't add anything
}

function activateDrum(button) { // function that will make the next round playable by activating the drums on the screen in the correct order. The value of button is used to select the appropriate drum and audio elements. In the HTML, the data-sound attribute on the audio elements correspond to the drum names
  const drum = document.querySelector(`[data-drum='${button}']`); // variable that selects the correct button on the HTML file
  const sound = document.querySelector(`[data-sound='${button}']`);// variable that selects the correct sound on the HTML file

  drum.classList.add('activated'); // activated class is added to the selected drum
  sound.play(); // play method is triggered on the selected audio element causing the linked mp3 to be played

  setTimeout(() => { // utilizing set timeout function 
    drum.classList.remove('activated'); // removes the activated class in the set timeout function. This makes it so each drum is activated for 300 milliseconds and there are 300 milliseconds between drum activations in the sequence
  }, 300); // ends after 300 milliseconds
}
  
function playRound(nextSequence) { // function that takes the next sequence array and iterates over it
    nextSequence.forEach((button, index) => { // function executes for each button and index value in the next sequence array
      setTimeout(() => { // utilizing the set timeout function to add an artificial delay between each button press. Without this all the drums in the sequence will activate all at once
        activateDrum(button); // will call the activate drum function for each button in the next sequence array
      }, (index + 1) * 600); // executes the activate drum function at 600 millisecond intervals for each value in the sequence. This changes on each iteration. First drum in the sequence is activated after 600ms, next one after 1200ms and so on
    });
}

function nextStep() { // creating next step function that will select a random drum in the drums array that needs to be clicked
    const drums = ['Kick', 'HiHat', 'Snare', 'Crash1', 'RackTom', 'Crash2', 'FloorTom', 'Ride']; // The drums variable contains the drums for each button on the page. These values correspond with the values of the data-drum property in the HTML
    const random = drums[Math.floor(Math.random() * drums.length)]; // Selects a random index value in the drums array to select a random drum button each time next step is executed
    return random; // returns the random index value from the drums array
}

function nextRound() { // The next round function will start the next sequence of clicks after the first sequence is completed
  drumContainer.classList.add('unclickable'); // unclickable class is added to the drum container when the round starts
  info.textContent = 'Wait for the computer'; // contents of info element are updated
  heading.textContent = `Level ${level}`; // contents of heading element are updated
  level += 1; // Each time next round is invoked, the level variable will be incremented by 1
  const nextSequence = [...sequence]; // copies all the elements in the sequence array to next sequence array using the spread operator. The spread operator copies all the elements within an existing array and pastes them into a new array.
  nextSequence.push(nextStep()); // When next step is executed, it returns a random value from the drums array and the value is added to the end of the next sequence array alongside any values from the previous round
  playRound(nextSequence); // calls the play round function so when the next round starts and a new sequence is made, the new sequence can be played in the round
  sequence = [...nextSequence]; // sequence variable is assigned to the updated next sequence array
  setTimeout(() => { // Utilizing set timeout function 
    humanTurn(level); // Executes human turn function one second after the last button in the sequence is activated
  }, level * 600 + 1000); // total duration of the sequence corresponds to the current level multiplied by 600 milliseconds which is the duration for each drum in the sequence
}

function handleClick(drum) { // creating handle click function that will execute when clicking a drum with a data-drum attribute
  const index = humanSequence.push(drum) - 1; // pushes the drum value to the human sequence array and stores its index in the index variable
  const sound = document.querySelector(`[data-sound='${drum}']`); // selects the sound to the corresponding drum that is being clicked
  sound.play(); // plays the sound of the corresponding drum when clicked
  const remainingTaps = sequence.length - humanSequence.length; // remaining steps in the sequence is calculated by subtracting the number of elements clicked by the total amount of elements in the original sequence
  if (humanSequence[index] !== sequence[index]) { // If statement that executes if the human sequence array was not equal to the sequence array. If the value of the element retrieved by the index in both the sequence and the human sequence arrays do not match, the player was incorrect
    resetGame('Oops! Game over, you pressed the wrong tile'); // reset game is executed and alert is displayed
    return; // ends if statement
  }
  if (humanSequence.length === sequence.length) { // If statement that executes if the human sequence array is equal to the sequence array
    humanSequence = []; // human sequence array is reset to empty array
    info.textContent = 'Success! Keep going!'; // updates info element to display that the sequence selected was correct
    setTimeout(() => { // utilizing set timeout function so the player can see the success message so it will not get overwritten immediately
      nextRound(); // next round function can begin if human sequence array was equal to sequence array
    }, 1000); // next round will execute after 1 second if the human sequence array was correct
    return; // ends if statement
  }

  info.textContent = `Your turn: ${remainingTaps} Tap${ // updating info element to display the number of taps left in the sequence each time the player clicks the correct drum
    remainingTaps > 1 ? 's' : '' // if the remaining taps left are more than 1, an s will be added to the word Tap to make it plural
  }`;
}

function startGame() { // start game function that executes when the start button is clicked
  startButton.classList.add('hidden'); // once the start button is clicked, it will be hidden on the page
  info.classList.remove('hidden'); // removes the hidden properties of the info element when the game starts. So the info element will appear when the button is clicked and display status messages
  info.textContent = 'Wait for the computer'; // the info element will say 'Wait for the computer' when the computer is creating sequences. This makes it so the player will know when to wait until the sequence finishes and when it is time for them to click the sequence
  nextRound(); // next round is called so when the start button is clicked a new sequence will be made and the round can be played
}

startButton.addEventListener('click', startGame); // start game function will run when start button is clicked
drumContainer.addEventListener('click', event => { // detects the player's button taps and decides whether to move to the next round or end the game 
  const { drum } = event.target.dataset; // the value of data-drum on the element that was clicked is accessed and stored in the drum variable

  if (drum) handleClick(drum); // if the value is not an empty string, for elements without the data-drum attribute, the handle click function is executed with the drum value as its only argument
});