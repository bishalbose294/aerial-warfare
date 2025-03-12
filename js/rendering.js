// Function to draw all game elements on the canvas.
function draw() {
    // Clears the entire canvas area to prepare for the next frame.
    ctx.clearRect(0, 0, window.baseWidth, window.baseHeight);
  
    // Draws the background image across the canvas, sourced from backgroundImg.
    ctx.drawImage(backgroundImg, 0, 0, window.baseWidth, window.baseHeight);
  
    // Gets the current player object.
    const player = players[localPlayerId];
  
    // Hides the cursor over the canvas and body, matching CSS 'cursor: none'.
    // canvas.style.cursor = 'none';
    // document.body.style.cursor = 'none';
  
    // Sets the fill style to green for the HP bar.
    ctx.fillStyle = 'green';
  
    // Draws the HP bar, scaled by the player’s HP (max 3).
    ctx.fillRect(50, 10, hpBarWidth * (player.hp / 3), hpBarHeight);
  
    // Sets the stroke style to black for the HP bar outline.
    ctx.strokeStyle = 'black';
  
    // Draws the HP bar outline.
    ctx.strokeRect(50, 10, hpBarWidth, hpBarHeight);
  
    // Sets the fill style to orange (#FF4500) for the HP text.
    ctx.fillStyle = '#FF4500';
  
    // Sets the font to 20px scaled by scaleRatio, using 'Comic Sans MS' from CSS.
    ctx.font = `${20 * scaleRatio}px Comic Sans MS`;
  
    // Aligns text to the left for the HP label.
    ctx.textAlign = 'left';
  
    // Draws the 'HP' label at position (10, 20).
    ctx.fillText('HP', 10, 20);
  
    // Sets the stroke style to black for the HP text outline.
    ctx.strokeStyle = 'black';
  
    // Sets the line width for the text outline.
    ctx.lineWidth = 2;
  
    // Draws the 'HP' label outline.
    ctx.strokeText('HP', 10, 20);
  
    // Sets the fill style to red for the score text.
    ctx.fillStyle = 'red';
  
    // Sets the font to 20px scaled by scaleRatio, using 'Comic Sans MS' from CSS.
    ctx.font = `${20 * scaleRatio}px Comic Sans MS`;
  
    // Aligns text to the right for the score.
    ctx.textAlign = 'right';
  
    // Draws the score text at the top-right corner.
    ctx.fillText(`Score: ${player.score}`, window.baseWidth - 10, 20);
  
    // Sets the stroke style to black for the score text outline.
    ctx.strokeStyle = 'black';
  
    // Sets the line width for the text outline.
    ctx.lineWidth = 2;
  
    // Draws the score text outline.
    ctx.strokeText(`Score: ${player.score}`, window.baseWidth - 10, 20);
  
    // Displays power-up timer if active.
    if (player.powerUp && player.powerUpTime > 0) {
      // Calculates remaining seconds from the power-up timer.
      const remainingSeconds = Math.ceil(player.powerUpTime / 60);
  
      // Sets the fill style to orange (#FF4500) for the power-up text.
      ctx.fillStyle = '#FF4500';
  
      // Sets the font to 24px scaled by scaleRatio, using 'Comic Sans MS' from CSS.
      ctx.font = `${24 * scaleRatio}px Comic Sans MS`;
  
      // Aligns text to the center for the power-up timer.
      ctx.textAlign = 'center';
  
      // Draws the power-up timer at the bottom center.
      ctx.fillText(`${player.powerUpName}: ${remainingSeconds}s`, window.baseWidth / 2, window.baseHeight - 20);
  
      // Sets the stroke style to black for the power-up text outline.
      ctx.strokeStyle = 'black';
  
      // Sets the line width for the text outline.
      ctx.lineWidth = 2;
  
      // Draws the power-up timer outline.
      ctx.strokeText(`${player.powerUpName}: ${remainingSeconds}s`, window.baseWidth / 2, window.baseHeight - 20);
    }
  
    // Displays wave number during the buffer period with a blinking effect.
    if (waveBuffer > 0 && waveBlinkCounter % 20 < 10) {
      // Sets the fill style to orange (#FF4500) for the wave text.
      ctx.fillStyle = '#FF4500';
  
      // Sets the font to 48px scaled by scaleRatio, using 'Comic Sans MS' from CSS.
      ctx.font = `${48 * scaleRatio}px Comic Sans MS`;
  
      // Aligns text to the center for the wave number.
      ctx.textAlign = 'center';
  
      // Draws the wave number at the center of the canvas.
      ctx.fillText(`WAVE ${waveCount + 1}`, window.baseWidth / 2, window.baseHeight / 2);
  
      // Sets the stroke style to black for the wave text outline.
      ctx.strokeStyle = 'black';
  
      // Sets the line width for the text outline.
      ctx.lineWidth = 3;
  
      // Draws the wave number outline.
      ctx.strokeText(`WAVE ${waveCount + 1}`, window.baseWidth / 2, window.baseHeight / 2);
    }
  
    // Draws all players (currently just 'solo').
    Object.values(players).forEach(p => {
      // Draws a glow effect if the glow timer is active.
      if (p.glowTime > 0) {
        ctx.beginPath(); // Starts a new path for the glow.
        ctx.arc(p.x + playerSize / 2, p.y + playerSize / 2, playerSize / 2 + 15, 0, Math.PI * 2); // Draws a circle around the player.
        ctx.fillStyle = 'rgba(255, 255, 0, 0.5)'; // Sets a semi-transparent yellow fill.
        ctx.fill(); // Fills the glow circle.
      }
  
      // Draws the player image if not blinking or on even blink cycles.
      if (p.blinkTime <= 0 || Math.floor(p.blinkTime / 10) % 2 === 0) {
        ctx.drawImage(myAirshipImg, p.x, p.y, 60, playerSize); // Draws the player at its position.
  
        // Draws a shield outline if the shield power-up is active.
        if (p.powerUp === 'shield') {
          ctx.strokeStyle = 'blue'; // Sets the stroke color to blue.
          ctx.lineWidth = 2; // Sets the line width.
          ctx.strokeRect(p.x - 5, p.y - 5, 70, playerSize + 10); // Draws a rectangle around the player.
        } else if (p.powerUp === 'burst') {
          // Draws burst indicators if the burst power-up is active.
          ctx.strokeStyle = 'orange'; // Sets the stroke color to orange.
          ctx.lineWidth = 2; // Sets the line width.
          ctx.beginPath(); // Starts a new path.
          ctx.moveTo(p.x + playerSize, p.y + playerSize / 2); // Moves to the right edge center.
          ctx.lineTo(p.x + playerSize + 10, p.y + playerSize / 2 - 5); // Draws an upward line.
          ctx.moveTo(p.x + playerSize, p.y + playerSize / 2); // Moves back to the center.
          ctx.lineTo(p.x + playerSize + 10, p.y + playerSize / 2); // Draws a straight line.
          ctx.moveTo(p.x + playerSize, p.y + playerSize / 2); // Moves back to the center.
          ctx.lineTo(p.x + playerSize + 10, p.y + playerSize / 2 + 5); // Draws a downward line.
          ctx.stroke(); // Strokes the path.
        } else if (p.powerUp === 'guard') {
          // Draws a guard circle if the guard power-up is active.
          ctx.beginPath(); // Starts a new path.
          ctx.arc(p.x + 30, p.y + playerSize / 2, playerSize / 2 + 15, 0, Math.PI * 2); // Draws a circle.
          ctx.strokeStyle = 'purple'; // Sets the stroke color to purple.
          ctx.lineWidth = 2; // Sets the line width.
          ctx.stroke(); // Strokes the circle.
        }
      }
    });
  
    // Draws all active bullets.
    bullets.forEach(b => {
      if (b.active) ctx.drawImage(bulletImg, b.x, b.y, bulletSize, bulletSize); // Draws each bullet at its position.
    });
  
    // Draws all active drone bullets.
    droneBullets.forEach(db => {
      if (db.active) ctx.drawImage(droneBulletImg, db.x, db.y, droneBulletSize, droneBulletSize); // Draws each drone bullet.
    });
  
    // Draws all active targets.
    targets.forEach(t => {
      if (t.hp > 0) {
        // Determines the size based on the target type.
        const size = t.type === 'plane' ? enemyPlaneSize : t.type === 'fly' ? flySize : t.type === 'kamikaze' ? kamikazeSize : bossFlySize;
  
        // Selects the appropriate image based on the target type.
        const img = t.type === 'plane' ? enemyAirshipImg : t.type === 'fly' ? flyImg : t.type === 'kamikaze' ? kamikazeImg : bossFlyImg;
  
        // Draws the target at its position.
        ctx.drawImage(img, t.x, t.y, size, size);
      }
    });
  
    // Draws all power-ups.
    powerUps.forEach(p => ctx.drawImage(powerUpImg, p.x, p.y, powerUpSize, powerUpSize)); // Draws each power-up.
  
    // Draws the joystick if in touch mode and active.
    if (window.controlMode === 'touch' && joystickActive && !isPaused) {
      ctx.beginPath(); // Starts a new path for the joystick base.
      ctx.arc(joystickBaseX, joystickBaseY, 50, 0, Math.PI * 2); // Draws a base circle.
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)'; // Sets a semi-transparent white fill.
      ctx.fill(); // Fills the base circle.
  
      ctx.beginPath(); // Starts a new path for the joystick handle.
      ctx.arc(joystickMoveX, joystickMoveY, 30, 0, Math.PI * 2); // Draws a handle circle.
      ctx.fillStyle = 'rgba(255, 255, 0, 0.4)'; // Sets a semi-transparent yellow fill.
      ctx.fill(); // Fills the handle circle.
    }
  
    // Requests the next animation frame to continue the draw loop.
    requestAnimationFrame(draw);
  }
  
  // Expose the draw function to the window object
  window.draw = draw;