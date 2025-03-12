// Function to resize the canvas dynamically based on window size.
function resizeCanvas() {
  // Calculates the aspect ratio of the base canvas (width/height) to maintain proportions.
  const aspectRatio = window.baseWidth / window.baseHeight;

  // Sets the canvas width to the window's inner width for full coverage.
  canvas.width = window.innerWidth;

  // Sets the canvas height to the window's inner height for full coverage.
  canvas.height = window.innerHeight;

  // Initializes gameWidth to the window width as a starting point.
  let gameWidth = canvas.width;

  // Increase the game width by 15% when not in fullscreen to reduce congestion on the right.
  if (!document.fullscreenElement) {
    gameWidth *= 1.2; //1.15
  }

  // Calculates the game height based on the aspect ratio to fit within the window width.
  let gameHeight = gameWidth / aspectRatio;

  // Checks if the calculated height exceeds the window height, adjusting if necessary.
  if (gameHeight > canvas.height) {
    // Sets gameHeight to the window height if it’s too large.
    gameHeight = canvas.height;

    // Recalculates gameWidth based on the new height and aspect ratio.
    gameWidth = gameHeight * aspectRatio;
  }

  // Updates scaleRatio based on the adjusted gameWidth relative to window.baseWidth for scaling drawings.
  scaleRatio = gameWidth / window.baseWidth;

  // Calculates the horizontal offset to center the canvas within the window.
  offsetX = (canvas.width - gameWidth) / 2;

  // Calculates the vertical offset to center the canvas within the window.
  offsetY = (canvas.height - gameHeight) / 2;

  // Applies the scale transformation to the canvas context for all drawings.
  ctx.setTransform(scaleRatio, 0, 0, scaleRatio, 0, 0);

  // Adjust canvas style based on fullscreen state to fix black borders.
  if (document.fullscreenElement) {
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.left = '0';
    canvas.style.top = '0';
  } else {
    canvas.style.width = `${gameWidth}px`;
    canvas.style.height = `${gameHeight}px`;
    canvas.style.left = `${offsetX}px`;
    canvas.style.top = `${offsetY}px`;
  }

  // Logs resize details to the console for debugging, including scaleRatio, offsets, and canvas styles.
  // console.log('Canvas resized:', {
  //   windowWidth: window.innerWidth,
  //   windowHeight: window.innerHeight,
  //   baseWidth: window.baseWidth,
  //   baseHeight: window.baseHeight,
  //   gameWidth,
  //   gameHeight,
  //   scaleRatio,
  //   offsetX,
  //   offsetY,
  //   canvasStyle: { width: canvas.style.width, height: canvas.style.height, left: canvas.style.left, top: canvas.style.top },
  //   fullscreen: !!document.fullscreenElement
  // });

  // Focuses the canvas to capture keyboard events (though not currently used).
  canvas.focus();
}

// Adds an event listener to the window for the 'resize' event, calling resizeCanvas() to adjust the canvas when the window size changes.
window.addEventListener('resize', resizeCanvas);

// Adds an event listener for the 'fullscreenchange' event, triggered when fullscreen mode changes. . Activates everytime we go fullscreen and smallscreen
document.addEventListener('fullscreenchange', () => {

  // Checks if the document is no longer in fullscreen mode and the game has started.
  if (!document.fullscreenElement && gameStarted) {
    // Resizes the canvas to adjust to the new window state after exiting fullscreen.
    resizeCanvas();

    // Hides the cursor over the canvas and body, matching CSS 'cursor: none' when active, controlled in 'script.js'.
    // canvas.style.cursor = 'none';
    // document.body.style.cursor = 'none';

    // Shows the leaderboard if it exists (currently unused due to removal).
    // if (leaderboard) leaderboard.style.display = 'block';

    // Ensures the endGamePopup remains visible if already shown.
    if (endGamePopup && endGamePopup.style.display === 'block') {
      endGamePopup.style.display = 'block';
    } 
    // else if (toggleControlsButton) {
    //   // Shows control buttons when exiting fullscreen if the game is active.
    //   toggleControlsButton.style.display = 'block';
    //   pauseResumeButton.style.display = 'block';
    //   resetButton.style.display = 'block';
    //   fullscreenButton.style.display = 'block';
    // }

    // Updates the fullscreen button text based on the current fullscreen state.
    if (fullscreenButton) {
      fullscreenButton.textContent = document.fullscreenElement ? 'Exit Fullscreen' : 'Fullscreen';
    }

    // Logs the game state to the console for debugging.
    // console.log('Exited fullscreen, game state:', { gameStarted, isPaused, inputMode });

    // Removes the existing mousemove listener to avoid duplicates.
    // canvas.removeEventListener('mousemove', handleMouseMove);

    // Adds the mousemove listener back to ensure it’s active after resize.
    // canvas.addEventListener('mousemove', handleMouseMove);
  }
});

// Calls resizeCanvas() initially to set up the canvas on page load.
resizeCanvas();

// Function to toggle fullscreen mode. Activates everytime we go fullscreen and smallscreen
function toggleFullscreen() {

  // Checks if the document is not in fullscreen mode.
  if (!document.fullscreenElement) {
    // Requests fullscreen mode for the canvas, triggering 'fullscreenchange' event.
    canvas.requestFullscreen().then(() => {
      // Shows the leaderboard if it exists (currently unused).
      // if (leaderboard) leaderboard.style.display = 'block';

      // Shows the toggleControlsButton if it exists.
      if (toggleControlsButton) toggleControlsButton.style.display = 'block';

      // Updates the fullscreenButton text to 'Exit Fullscreen'.
      if (fullscreenButton) fullscreenButton.textContent = 'Exit Fullscreen';
    }).catch(err => console.log(`Error attempting to enable fullscreen: ${err.message}`)); // Logs fullscreen errors.
  } else {
    // Exits fullscreen mode, triggering 'fullscreenchange' event.
    document.exitFullscreen().then(() => {
      // Updates the fullscreenButton text to 'Fullscreen'.
      if (fullscreenButton) fullscreenButton.textContent = 'Fullscreen';
    }).catch(err => console.log(`Error exiting fullscreen: ${err.message}`)); // Logs exit errors.
    
  }
}

// Expose canvas setup variables and functions to the window object
window.scaleRatio = scaleRatio;
window.window.baseWidth = window.baseWidth;
window.window.baseHeight = window.baseHeight;
window.offsetX = offsetX;
window.offsetY = offsetY;
window.resizeCanvas = resizeCanvas;
window.toggleFullscreen = toggleFullscreen;