// Sets the toggleControlsButton text based on the initial inputMode, styled in CSS with 'font-family: Comic Sans MS'.
if (toggleControlsButton) {
  if (window.controlMode !== undefined) {
    toggleControlsButton.textContent = window.controlMode === 'touch' ? 'Switch to Mouse Mode' : 'Switch to Touch Mode';
    window.joystickActive = true
  } else {
    console.warn('inputMode is undefined at initialization, toggleControlsButton text not set');
  }
}

// Function to reset the game state to initial conditions.
function resetGame() {
  // Gets the current player object.
  const player = players[localPlayerId];

  // Resets the player’s X position to the center of the canvas.
  player.x = window.baseWidth / 2 - playerSize / 2;

  // Resets the player’s Y position to the center of the canvas.
  player.y = window.baseHeight / 2 - playerSize / 2;

  // Resets the player’s score to 0.
  player.score = 0;

  // Resets the player’s HP to 3.
  player.hp = 3;

  // Resets the player’s power-up to null.
  player.powerUp = null;

  // Resets the power-up timer to 0.
  player.powerUpTime = 0;

  // Resets the blink timer to 0.
  player.blinkTime = 0;

  // Resets the glow timer to 0.
  player.glowTime = 0;

  // Clears all bullets from the array.
  bullets.length = 0;

  // Clears all targets from the array.
  targets.length = 0;

  // Clears all power-ups from the array.
  powerUps.length = 0;

  // Clears all drone bullets from the array.
  droneBullets.length = 0;

  // Resets the power-up timer.
  powerUpTimer = 0;

  // Resets the boss timer.
  bossTimer = 0;

  // Resets the wave timer.
  waveTimer = 0;

  // Resets the wave count.
  waveCount = 0;

  // Resets the frame count.
  frameCount = 0;

  // Resets the wave buffer.
  waveBuffer = 0;

  // Resets the wave blink counter.
  waveBlinkCounter = 0;

  // Shows the leaderboard if it exists (currently unused).
  // if (leaderboard) leaderboard.style.display = 'block';

  // Hides the endGamePopup if it exists.
  if (endGamePopup) endGamePopup.style.display = 'none';

  // Sets the paused state to false.
  isPaused = false;

  // Updates the pauseResumeButton text to 'Pause' if it exists.
  if (pauseResumeButton) pauseResumeButton.textContent = 'Pause';

  // Logs the reset action to the console for debugging.
  // console.log('Game reset');
}

// Function to toggle the pause state.
function togglePause() {
  if (gameStarted) {
    const previousPausedState = isPaused;
    isPaused = !isPaused;
    if (pauseResumeButton) {
      pauseResumeButton.textContent = isPaused ? 'Resume' : 'Pause';
    }
    // console.log(`TogglePause called: Game ${isPaused ? 'paused' : 'resumed'} via P key`, {
    //   previousPausedState,
    //   newPausedState: isPaused,
    //   gameStarted
    // });
  } else {
    console.warn('TogglePause called but game is not started', { gameStarted });
  }
}

// Function to toggle controls visibility (updates button text to reflect current mode).
function toggleControlsVisibility() {
  if (gameStarted && toggleControlsButton) {
    // Toggles the window.controlMode between 'mouse' and 'touch'.
    window.controlMode = window.controlMode === 'mouse' ? 'touch' : 'mouse';

    // Updates the button text based on the new window.controlMode.
    toggleControlsButton.textContent = window.controlMode === 'touch' ? 'Switch to Mouse Mode' : 'Switch to Touch Mode';
    // console.log('Controls visibility toggled, mode displayed as:', inputMode);

    if (window.controlMode === 'touch') {
      window.joystickActive = true
      window.canvas.addEventListener('touchend', touchend_event)
      window.canvas.addEventListener('touchmove', touchmove_event)
      window.canvas.addEventListener('touchstart', touchstart_event)
      window.canvas.removeEventListener('mousemove', handleMouseMove);
      window.canvas.removeEventListener('click', click_event);
    }
    else {
      window.joystickActive = false
      window.canvas.addEventListener('mousemove', handleMouseMove);
      window.canvas.addEventListener('click', click_event);
      window.canvas.removeEventListener('touchend', touchend_event)
      window.canvas.removeEventListener('touchmove', touchmove_event)
      window.canvas.removeEventListener('touchstart', touchstart_event)
    }

    updateButtonVisibility()

    updateHelpTextVisibility()
  }
}

// Function to handle game over logic.
function endGame() {
  const player = players[localPlayerId];

  // Load the personal best from localStorage
  const personalBestKey = `personalBest_${player.name}`;
  let personalBest = parseInt(localStorage.getItem(personalBestKey)) || 0;

  // Update personal best if the current score is higher
  if (player.score > personalBest) {
    personalBest = player.score;
    localStorage.setItem(personalBestKey, personalBest);
  }

  // Update the personal best display at the top right
  const personalBestDisplay = document.getElementById('personalBestDisplay');
  if (personalBestDisplay) {
    personalBestDisplay.textContent = `Personal Best: ${personalBest}`;
  }

  // Update the finalScoreDisplay with the player’s score and personal best
  if (finalScoreDisplay) {
    finalScoreDisplay.textContent = `Your Score: ${player.score} | Personal Best: ${personalBest}`;
  }

  // Show the endGamePopup
  if (endGamePopup) endGamePopup.style.display = 'block';

  // Hide control buttons
  updateButtonVisibility();

  // Set gameStarted to false
  gameStarted = false;

  // Handle fullscreen exit if active
  if (document.fullscreenElement) {
    document.exitFullscreen().then(() => {
      if (endGamePopup) endGamePopup.style.display = 'block';
      // Remove: if (leaderboard) leaderboard.style.display = 'block'; // Leaderboard removed
      if (fullscreenButton) fullscreenButton.textContent = 'Fullscreen';
    }).catch(err => console.log(`Error exiting fullscreen: ${err.message}`));
  } else {
    // Remove: if (leaderboard) leaderboard.style.display = 'block'; // Leaderboard removed
    if (fullscreenButton) fullscreenButton.textContent = 'Fullscreen';
  }
}

// Adds event listeners for the start screen functionality if all required elements exist.
if (startGameButton && playerNameInput && startScreen && toggleControlsButton) {
  // Disables the startGameButton initially until a name is entered.
  startGameButton.disabled = true;

  // Adds an input event listener to playerNameInput to enable/disable startGameButton.
  playerNameInput.addEventListener('input', () => {
    // Gets the trimmed value of the input field.
    const name = playerNameInput.value.trim();

    // Enables the button only if the name is non-empty.
    startGameButton.disabled = !name || name.length === 0;
  });

  // Adds a click event listener to startGameButton to start the game.
  startGameButton.addEventListener('click', () => {
    if (startScreen && toggleControlsButton) {
      playerName = playerNameInput.value.trim();
      if (!playerName) playerName = 'Player';
      players[localPlayerId].name = playerName;
  
      // Add this: Display personal best on game start
      const personalBestKey = `personalBest_${playerName}`;
      const personalBest = parseInt(localStorage.getItem(personalBestKey)) || 0;
      const personalBestDisplay = document.getElementById('personalBestDisplay');
      if (personalBestDisplay) {
        personalBestDisplay.textContent = `Personal Best: ${personalBest}`;
      }
  
      startScreen.style.display = 'none';
      gameStarted = true;
      if (pauseResumeButton) pauseResumeButton.textContent = 'Pause';
      // console.log('Start screen hidden, game started with name:', playerName);
      updateInputModeDisplay();
    }
  });
} else {
  // Logs an error if any required start screen elements are missing.
  console.error('startGameButton, playerNameInput, startScreen, or toggleControlsButton not found');
}

// Adds event listeners for the play again functionality if required elements exist.
if (playAgainButton && endGamePopup) {
  // Adds a click event listener to playAgainButton to restart the game.
  playAgainButton.addEventListener('click', () => {
    // Resets the game state.
    resetGame();

    // Hides the endGamePopup, controlled by CSS 'display: none' initially.
    endGamePopup.style.display = 'none';

    // Sets the gameStarted flag to true.
    gameStarted = true;

    // Shows or hides control buttons based on input mode
    // updateButtonVisibility();

    // Updates the pauseResumeButton text to 'Pause'.
    if (pauseResumeButton) pauseResumeButton.textContent = 'Pause';

    // Update body data attribute to reflect input mode for CSS
    updateInputModeDisplay();
  });
} else {
  // Logs an error if any required play again elements are missing.
  console.error('playAgainButton or endGamePopup not found');
}

// Adds event listeners for the control buttons if all exist.
if (pauseResumeButton && resetButton && toggleControlsButton && fullscreenButton) {
  // Adds a click event listener to pauseResumeButton to toggle pause state.
  pauseResumeButton.addEventListener('click', () => {
    if (gameStarted) {
      // Toggles the isPaused flag.
      isPaused = !isPaused;

      // Updates the button text based on the pause state.
      pauseResumeButton.textContent = isPaused ? 'Resume' : 'Pause';

      // Logs the pause/resume action for debugging.
      // console.log(`Game ${isPaused ? 'paused' : 'resumed'}`);
    }
  });

  // Adds a click event listener to resetButton to reset the game.
  resetButton.addEventListener('click', () => {
    if (gameStarted) {
      // Resets the game state.
      resetGame();

      // Logs the reset action for debugging.
      // console.log('Game reset');
    }
  });

  // Adds a click event listener to toggleControlsButton to switch control modes.
  toggleControlsButton.addEventListener('click', toggleControlsVisibility);


  // Adds a click event listener to fullscreenButton to toggle fullscreen mode.
  fullscreenButton.addEventListener('click', () => {
    if (gameStarted) {
      // Calls the toggleFullscreen function.
      toggleFullscreen();

      // Logs the fullscreen toggle action for debugging.
      // console.log('Fullscreen toggled manually');
    }
  });
} else {
  // Logs an error if any required control buttons are missing.
  console.error('pauseResumeButton, resetButton, toggleControlsButton, or fullscreenButton not found');
}

// Function to update the leaderboard display (currently ineffective without leaderboard implementation).
// function updateLeaderboardDisplay() {
//   if (leaderboardList) {
//     leaderboardList.innerHTML = '';
//     leaders.forEach((entry, index) => {
//       const li = document.createElement('li');
//       li.textContent = `${index + 1}. ${entry.name}: ${entry.score}`;
//       leaderboardList.appendChild(li);
//     });
//   }
// }

// Function to update the body data attribute to reflect input mode for CSS styling of help text.
function updateInputModeDisplay() {
  if (window.controlMode !== undefined) {
    document.body.dataset.inputMode = window.controlMode;
    // console.log('Input mode updated in body data attribute:', inputMode);
    // Ensure help text visibility is updated
    updateHelpTextVisibility();
  }
}

// Function to update button visibility based on input mode
function updateButtonVisibility() {
  if (window.controlMode === 'mouse' && gameStarted) {
    pauseResumeButton.style.display = 'none';
    resetButton.style.display = 'none';
    fullscreenButton.style.display = 'none';
  } else {
    pauseResumeButton.style.display = 'block';
    resetButton.style.display = 'block';
    fullscreenButton.style.display = 'block';
  }
  toggleControlsButton.style.display = 'block'; // Keep toggleControls visible
}

// Function to update help text visibility (ensures it matches input mode)
function updateHelpTextVisibility() {
  const helpText = document.getElementById('helpText');
  if (window.controlMode === 'mouse') {
    helpText.style.display = 'block';
  } else {
    helpText.style.display = 'none';
  }
}

// Expose game flow functions to the window object
window.resetGame = resetGame;
window.togglePause = togglePause;
window.toggleControlsVisibility = toggleControlsVisibility;
window.endGame = endGame;