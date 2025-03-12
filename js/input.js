// Function to handle mouse movement for player control.
function handleMouseMove(e) {
  // Logs the mousemove event for debugging.
  // console.log('mousemove event fired');

  // Ensure canvas exists
  if (!canvas) {
    console.error('Canvas element is not defined');
    return;
  }

  // Sets mouse mode if not already set on the first mouse event.
  if (inputMode === undefined) {
    inputMode = 'mouse';
    // console.log('Input mode set to mouse');
  }

  // Checks if the game is started and not paused to allow movement (works in both modes).
  if (gameStarted && !isPaused) {
    // Gets the bounding rectangle of the canvas to convert screen coordinates.
    const rect = canvas.getBoundingClientRect();
    // console.log('Canvas rect:', { left: rect.left, top: rect.top, width: rect.width, height: rect.height });

    // Calculates the raw mouse X coordinate relative to the canvas left edge.
    const rawMouseX = e.clientX - rect.left;
    // console.log('Raw mouse X:', rawMouseX);

    // Calculates the raw mouse Y coordinate relative to the canvas top edge.
    const rawMouseY = e.clientY - rect.top;
    // console.log('Raw mouse Y:', rawMouseY);

    // Verify scaleRatio and canvas dimensions
    if (!scaleRatio || scaleRatio <= 0) {
      console.error('scaleRatio is invalid:', scaleRatio);
      return;
    }
    if (!window.baseWidth || !window.baseHeight) {
      console.error('window.baseWidth or window.baseHeight is invalid:', { baseWidth: window.baseWidth, baseHeight: window.baseHeight });
      return;
    }

    // Adjusts the mouse X coordinate by the scaleRatio for game coordinates.
    const mouseX = rawMouseX / scaleRatio;
    // console.log('Adjusted mouse X (after scaleRatio):', mouseX);

    // Adjusts the mouse Y coordinate by the scaleRatio for game coordinates.
    const mouseY = rawMouseY / scaleRatio;
    // console.log('Adjusted mouse Y (after scaleRatio):', mouseY);

    // Clamps the X coordinate to stay within the game boundaries (0 to window.baseWidth - playerSize).
    const clampedX = Math.max(0, Math.min(window.baseWidth - playerSize, mouseX));
    // console.log('Clamped X:', clampedX);

    // Clamps the Y coordinate to stay within the game boundaries (0 to window.baseHeight - playerSize).
    const clampedY = Math.max(0, Math.min(window.baseHeight - playerSize, mouseY));
    // console.log('Clamped Y:', clampedY);

    // Updates the player’s X position with the clamped value.
    if (players[localPlayerId]) {
      players[localPlayerId].x = clampedX;
      // console.log('Player X updated to:', players[localPlayerId].x);
    } else {
      console.error('players[localPlayerId] is undefined, cannot update position');
    }

    // Updates the player’s Y position with the clamped value.
    if (players[localPlayerId]) {
      players[localPlayerId].y = clampedY;
      // console.log('Player Y updated to:', players[localPlayerId].y);
    } else {
      console.error('players[localPlayerId] is undefined, cannot update position');
    }

    // Ensures the player stays within bounds using the clampPlayerPosition function.
    clampPlayerPosition();
    // console.log('After clampPlayerPosition, Player X:', players[localPlayerId]?.x, 'Y:', players[localPlayerId]?.y);

    // Hides the cursor over the canvas and body, matching CSS 'cursor: none'.
    // canvas.style.cursor = 'none';
    // document.body.style.cursor = 'none';
  } else {
    // Logs when mouse movement is ignored for debugging.
    // console.log('Mouse move ignored:', { inputMode, gameStarted, isPaused });
  }
}

// Adds an event listener to the canvas for the 'mousemove' event, calling handleMouseMove() to update player position.
if (canvas) {
  canvas.addEventListener('mousemove', handleMouseMove);
} else {
  console.error('Cannot add mousemove event listener: canvas is not defined');
}

// Function to clamp the player’s position within the canvas boundaries.
function clampPlayerPosition() {
  // Gets the current player object.
  const player = players[localPlayerId];

  if (!player) {
    console.error('Cannot clamp player position: player is undefined');
    return;
  }

  // Ensures the player’s X position is not less than 0.
  if (player.x < 0) player.x = 0;

  // Ensures the player’s X position does not exceed the canvas width minus player size.
  if (player.x > window.baseWidth - playerSize) player.x = window.baseWidth - playerSize;

  // Ensures the player’s Y position is not less than 0.
  if (player.y < 0) player.y = 0;

  // Ensures the player’s Y position does not exceed the canvas height minus player size.
  if (player.y > window.baseHeight - playerSize) player.y = window.baseHeight - playerSize;
}

function click_event(){
  // Fires a bullet if the game is started and not paused (works in both modes).
  if (gameStarted && !isPaused) fireBullet();
}

// Adds an event listener to the canvas for the 'click' event to fire bullets.
if (canvas) {
  canvas.addEventListener('click', click_event);
} else {
  console.error('Cannot add click event listener: canvas is not defined');
}

function touchstart_event(e){
  console.log('touchstart event fired', { touches: e.changedTouches.length });

  // Prevents default touch behavior (e.g., scrolling) to ensure game control.
  e.preventDefault();

  // Exits if the game hasn’t started to avoid input before initialization.
  if (!gameStarted) {
    console.log('touchstart ignored: game not started');
    return;
  }

  // Sets touch mode if not already set on the first touch event.
  if (inputMode === undefined) {
    inputMode = 'touch';
    console.log('Input mode set to touch');
  }

  // Gets the array of touch points from the event.
  const touches = e.changedTouches;

  // Loops through each touch point to process input.
  for (let i = 0; i < touches.length; i++) {
    // Verify offset and scaleRatio values
    if (typeof offsetX === 'undefined' || typeof offsetY === 'undefined') {
      console.error('offsetX or offsetY is undefined:', { offsetX, offsetY });
      return;
    }
    if (!scaleRatio || scaleRatio <= 0) {
      console.error('scaleRatio is invalid:', scaleRatio);
      return;
    }

    // Calculates the touch X coordinate adjusted by offsetX and scaleRatio.
    const touchX = (touches[i].clientX - offsetX) / scaleRatio;
    console.log('Touch X calculated:', { rawX: touches[i].clientX, offsetX, scaleRatio, touchX });

    // Calculates the touch Y coordinate adjusted by offsetY and scaleRatio.
    const touchY = (touches[i].clientY - offsetY) / scaleRatio;
    console.log('Touch Y calculated:', { rawY: touches[i].clientY, offsetY, scaleRatio, touchY });

    // Checks if the game is not paused (works in touch mode without restricting to inputMode).
    if (!isPaused) {
      // Activates the joystick if the touch is on the left half and not already active.
      if (touchX < window.baseWidth / 2 && !joystickActive) {
        joystickActive = true;
        joystickBaseX = touchX;
        joystickBaseY = touchY;
        joystickMoveX = joystickBaseX;
        joystickMoveY = joystickBaseY;
        console.log('Joystick activated:', { joystickBaseX, joystickBaseY });
      } else if (touchX >= window.baseWidth / 2 && !fireActive) {
        // Activates firing if the touch is on the right half and not already active.
        fireActive = true;
        fireBullet();
        console.log('Firing activated');
      }
    } else {
      console.log('touchstart ignored: game is paused');
    }
  }
}

// Adds an event listener to the canvas for the 'touchstart' event to handle touch input.
if (canvas) {
  canvas.addEventListener('touchstart', touchstart_event);
} else {
  console.error('Cannot add touchstart event listener: canvas is not defined');
}

function touchmove_event(e){
  console.log('touchmove event fired', { touches: e.touches.length });

  // Prevents default touch behavior to ensure game control.
  e.preventDefault();

  // Updates joystick position if active and not paused (works in touch mode without restricting to inputMode).
  if (joystickActive && !isPaused) {
    // Gets the array of current touch points.
    const touches = e.touches;

    // Loops through each touch point to process movement.
    for (let i = 0; i < touches.length; i++) {
      // Verify offset and scaleRatio values
      if (typeof offsetX === 'undefined' || typeof offsetY === 'undefined') {
        console.error('offsetX or offsetY is undefined:', { offsetX, offsetY });
        return;
      }
      if (!scaleRatio || scaleRatio <= 0) {
        console.error('scaleRatio is invalid:', scaleRatio);
        return;
      }

      // Calculates the touch X coordinate adjusted by offsetX and scaleRatio.
      const touchX = (touches[i].clientX - offsetX) / scaleRatio;
      console.log('Touchmove X calculated:', { rawX: touches[i].clientX, offsetX, scaleRatio, touchX });

      // Calculates the touch Y coordinate adjusted by offsetY and scaleRatio.
      const touchY = (touches[i].clientY - offsetY) / scaleRatio;
      console.log('Touchmove Y calculated:', { rawY: touches[i].clientY, offsetY, scaleRatio, touchY });

      // Updates joystick position if the touch is on the left half.
      if (touchX < window.baseWidth / 2) {
        joystickMoveX = touchX;
        joystickMoveY = touchY;

        // Calculates the distance and direction from the base point.
        const dx = joystickMoveX - joystickBaseX;
        const dy = joystickMoveY - joystickBaseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 50;

        // Limits the joystick movement to a maximum distance.
        if (distance > maxDistance) {
          const angle = Math.atan2(dy, dx);
          joystickMoveX = joystickBaseX + maxDistance * Math.cos(angle);
          joystickMoveY = joystickBaseY + maxDistance * Math.sin(angle);
        }
        console.log('Joystick moved:', { joystickMoveX, joystickMoveY, dx, dy, distance });
      }
    }
  } else {
    console.log('touchmove ignored:', { joystickActive, isPaused });
  }
}

// Adds an event listener to the canvas for the 'touchmove' event to update joystick position.
if (canvas) {
  canvas.addEventListener('touchmove', touchmove_event);
} else {
  console.error('Cannot add touchmove event listener: canvas is not defined');
}

function touchend_event(e){
  console.log('touchend event fired', { touches: e.changedTouches.length });

  // Prevents default touch behavior to ensure game control.
  e.preventDefault();

  // Gets the array of touch points that ended.
  const touches = e.changedTouches;

  // Loops through each ended touch point to process release.
  for (let i = 0; i < touches.length; i++) {
    // Verify offset and scaleRatio values
    if (typeof offsetX === 'undefined' || typeof offsetY === 'undefined') {
      console.error('offsetX or offsetY is undefined:', { offsetX, offsetY });
      return;
    }
    if (!scaleRatio || scaleRatio <= 0) {
      console.error('scaleRatio is invalid:', scaleRatio);
      return;
    }

    // Calculates the touch X coordinate adjusted by offsetX and scaleRatio.
    const touchX = (touches[i].clientX - offsetX) / scaleRatio;
    console.log('Touchend X calculated:', { rawX: touches[i].clientX, offsetX, scaleRatio, touchX });

    // Resets joystick if the touch was on the left half and active.
    if (touchX < window.baseWidth / 2 && joystickActive) {
      joystickActive = false;
      joystickMoveX = joystickBaseX;
      joystickMoveY = joystickBaseY;
      console.log('Joystick deactivated');
    } else if (touchX >= window.baseWidth / 2 && fireActive) {
      // Resets firing if the touch was on the right half and active.
      fireActive = false;
      console.log('Firing deactivated');
    }
  }
}

// Adds an event listener to the canvas for the 'touchend' event to reset touch input.
if (canvas) {
  canvas.addEventListener('touchend', touchend_event);
} else {
  console.error('Cannot add touchend event listener: canvas is not defined');
}

// Add keyboard event listener for shortcuts in mouse mode.
document.addEventListener('keydown', handleKeyboardInput);

// Function to handle keyboard input for shortcuts in mouse mode.
function handleKeyboardInput(event) {
  if (inputMode === 'mouse' && gameStarted) {
    switch (event.key) {
      case 'p': // Pause/Resume
        if (typeof togglePause === 'function') {
          togglePause();
          // console.log('P key pressed, togglePause called');
        } else {
          console.error('togglePause function is not defined');
        }
        break;
      case 'r': // Reset
        if (typeof resetGame === 'function') {
          resetGame();
          // console.log('R key pressed, resetGame called');
        } else {
          console.error('resetGame function is not defined');
        }
        break;
      case 'c': // Toggle Controls
        if (typeof toggleControlsVisibility === 'function') {
          toggleControlsVisibility();
          // console.log('C key pressed, toggleControlsVisibility called');
        } else {
          console.error('toggleControlsVisibility function is not defined');
        }
        break;
      case 'f': // Toggle Fullscreen
        toggleFullscreen();
        // console.log('F key pressed, toggleFullscreen called');
        break;
    }
    // console.log('Keyboard shortcut pressed:', event.key);
  } else {
    // console.log('Keyboard input ignored:', { inputMode, gameStarted, isPaused });
  }
}

// Expose input-related functions to the window object
window.handleMouseMove = handleMouseMove;
window.clampPlayerPosition = clampPlayerPosition;