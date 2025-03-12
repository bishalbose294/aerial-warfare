// Function to fire bullets based on the player’s power-up state.
function fireBullet() {
    // Gets the current player object.
    const player = players[localPlayerId];
  
    // Fires multiple bullets in a burst pattern if the power-up is active and game isn’t paused.
    if (player.powerUp === 'burst' && !isPaused) {
      bullets.push({ x: player.x + playerSize, y: player.y + playerSize / 2 - bulletSize / 2, dx: bulletSpeed, dy: 0, owner: localPlayerId, active: true });
      bullets.push({ x: player.x + playerSize, y: player.y + playerSize / 2 - bulletSize / 2, dx: bulletSpeed * Math.cos(Math.PI / 12), dy: -bulletSpeed * Math.sin(Math.PI / 12), owner: localPlayerId, active: true });
      bullets.push({ x: player.x + playerSize, y: player.y + playerSize / 2 - bulletSize / 2, dx: bulletSpeed * Math.cos(-Math.PI / 12), dy: bulletSpeed * Math.sin(Math.PI / 12), owner: localPlayerId, active: true });
    } else if (!isPaused) {
      // Fires a single bullet if no burst power-up and game isn’t paused.
      bullets.push({ x: player.x + playerSize, y: player.y + playerSize / 2 - bulletSize / 2, dx: bulletSpeed, dy: 0, owner: localPlayerId, active: true });
    }
  }
  
  // Function to spawn power-up items randomly on the canvas.
  function spawnPowerUps() {
    // Clears existing power-ups from the array.
    powerUps.length = 0;
  
    // Creates a shuffled copy of powerUpTypes for random power-up assignment.
    const shuffledTypes = [...powerUpTypes].sort(() => Math.random() - 0.5);
  
    // Loops 4 times to spawn 4 power-ups.
    for (let i = 0; i < 4; i++) {
      // Generates a random X coordinate within the canvas, avoiding edges.
      const x = Math.random() * (window.baseWidth - powerUpSize * 2) + powerUpSize;
  
      // Generates a random Y coordinate within the canvas, avoiding edges.
      const y = Math.random() * (window.baseHeight - powerUpSize * 2) + powerUpSize;
  
      // Adds a power-up object with random position and a shuffled type.
      powerUps.push({ x: x, y: y, type: shuffledTypes[i].effect, name: shuffledTypes[i].name });
    }
  }
  
  // Function to update the game state every frame.
  function update() {
    // Exits the function if the game hasn’t started or is paused, preventing updates.
    if (!gameStarted || isPaused) return;
  
    // Gets the current player object.
    const player = players[localPlayerId];
  
    // Sets the current movement speed based on the playerSpeed constant.
    const currentSpeed = playerSpeed;
  
    // Handles touch joystick movement if active.
    if (window.controlMode === 'touch' && window.joystickActive) {
      // Calculates the X difference from the base point.
      const dx = joystickMoveX - joystickBaseX;
  
      // Calculates the Y difference from the base point.
      const dy = joystickMoveY - joystickBaseY;
  
      // Calculates the distance from the base point using the Pythagorean theorem.
      const distance = Math.sqrt(dx * dx + dy * dy);
  
      // Moves the player if there’s any distance.
      if (distance > 0) {
        // Limits the speed based on distance and playerSpeed.
        const speed = Math.min(distance * 0.2, currentSpeed);
  
        // Updates the player’s X position based on the direction and speed.
        player.x += (dx / distance) * speed;
  
        // Updates the player’s Y position based on the direction and speed.
        player.y += (dy / distance) * speed;
  
        // Ensures the player stays within bounds.
        clampPlayerPosition();
      }
    }
  
    // Manages power-up effects if active.
    if (player.powerUp && player.powerUpTime > 0) {
      // Decrements the power-up timer.
      player.powerUpTime--;
  
      // Fires a bullet every other frame if the rapid power-up is active.
      if (player.powerUp === 'rapid' && player.powerUpTime % 2 === 0) fireBullet();
    } else {
      // Resets the power-up to null if the timer expires.
      player.powerUp = null;
    }
  
    // Decrements the blink timer if greater than 0, used for invincibility flashing.
    if (player.blinkTime > 0) player.blinkTime--;
  
    // Decrements the glow timer if greater than 0, used for power-up collection effect.
    if (player.glowTime > 0) player.glowTime--;
  
    // Updates all bullets’ positions.
    bullets.forEach(b => {
      // Updates only active bullets.
      if (b.active) {
        // Moves the bullet horizontally based on its dx or bulletSpeed, scaled by scaleRatio.
        b.x += (b.dx || bulletSpeed) * scaleRatio;
  
        // Moves the bullet vertically based on its dy or 0, scaled by scaleRatio.
        b.y += (b.dy || 0) * scaleRatio;
  
        // Deactivates the bullet if it leaves the canvas boundaries.
        if (b.x > window.baseWidth-10 || b.x < 0 || b.y < 0 || b.y > window.baseHeight) b.active = false;
  
        // Logs bullet position for debugging.
        // console.log('Bullet position:', { x: b.x, y: b.y, window.baseWidth, scaleRatio, active: b.active });
      }
    });
  
    // Updates all drone bullets’ positions.
    droneBullets.forEach(db => {
      // Updates only active drone bullets.
      if (db.active) {
        // Moves the drone bullet left at a fixed speed, scaled by scaleRatio.
        db.x -= 3 * scaleRatio;
  
        // Deactivates the drone bullet if it leaves the left boundary.
        if (db.x < 0) db.active = false;
      }
    });
  
    // Increments the wave timer.
    waveTimer++;
  
    // Starts a new wave every 1800 frames (30 seconds at 60 FPS).
    if (waveTimer >= 1800) {
      waveTimer = 0; // Resets the wave timer.
      waveBuffer = 120; // Sets a 2-second buffer (120 frames).
      waveCount++; // Increments the wave count.
      waveBlinkCounter = 0; // Resets the blink counter.
      // console.log(`Wave ${waveCount + 1} prepared`); // Logs the new wave.
    }
  
    // Manages the wave buffer period.
    if (waveBuffer > 0) {
      waveBuffer--; // Decrements the buffer.
      waveBlinkCounter++; // Increments the blink counter.
      return; // Exits to pause normal updates during the buffer.
    }
  
    // Calculates the spawn chance, increasing with wave count.
    let spawnChance = 0.03 + waveCount * 0.015;
  
    // Calculates the plane speed, increasing with wave count.
    let planeSpeed = 2 + waveCount * 0.5;
  
    // Defines the leaderboard width (150px from CSS), used to adjust spawn position.
    // const leaderboardWidth = 150;
  
    // Scales the leaderboard width by the current scaleRatio.
    // const scaledLeaderboardWidth = leaderboardWidth / scaleRatio;
  
    // Sets the spawn X position to the right edge, adjusted for the leaderboard width.
    const spawnX = window.baseWidth - 50 //- scaledLeaderboardWidth;
  
    // Spawns a new enemy if the random chance is met.
    if (Math.random() < spawnChance) {
      // Generates a random Y position within the canvas, avoiding edge collisions.
      const y = Math.random() * (window.baseHeight - Math.max(enemyPlaneSize, flySize));
  
      // Randomly selects between 'fly' and 'plane' with 50% chance.
      const type = Math.random() < 0.5 ? 'fly' : 'plane';
  
      // Generates a random amplitude for sinusoidal movement.
      const amplitude = 20 + Math.random() * 40;
  
      // Generates a random frequency for sinusoidal movement.
      const frequency = 0.03 + Math.random() * 0.04;
  
      // Generates a random phase for sinusoidal movement.
      const phase = Math.random() * Math.PI * 2;
  
      // Adds a new target object with the generated properties.
      targets.push({ x: spawnX, y: y, baseY: y, type: type, hp: 1, amplitude, frequency, phase });
  
      // Logs the spawn action for debugging.
      // console.log(`Spawned: ${type} at x: ${spawnX}`);
    }
  
    // Manages kamikaze drone spawning in later waves.
    let droneSpawnChance = 0.02 + waveCount * 0.03;
    if (waveCount >= 1 && waveTimer >= 1200 && waveTimer < 1800) {
      // Spawns a kamikaze if the random chance is met.
      if (Math.random() < droneSpawnChance) {
        // Generates a random Y position within the canvas.
        const y = Math.random() * (window.baseHeight - kamikazeSize);
  
        // Adds a new kamikaze target with targeting behavior.
        targets.push({ x: spawnX, y: y, baseY: y, type: 'kamikaze', hp: 1, targetX: player.x, targetY: player.y, shootTimer: 0 });
  
        // Logs the spawn action for debugging.
        // console.log("Spawned: kamikaze at x:", spawnX);
      }
    }
  
    // Manages boss fly spawning every 1800 frames.
    bossTimer++;
    if (bossTimer >= 1800) {
      bossTimer = 0; // Resets the boss timer.
      // Generates a random Y position within the canvas.
      const y = Math.random() * (window.baseHeight - bossFlySize);
  
      // Adds a new boss fly target with higher HP.
      targets.push({ x: spawnX, y: y, baseY: y, type: 'bossFly', hp: 5 });
  
      // Logs the spawn action for debugging.
      // console.log("Boss Fly spawned at x:", spawnX);
    }
  
    // Manages power-up spawning every 900 frames (15 seconds at 60 FPS).
    powerUpTimer++;
    if (powerUpTimer >= 900) {
      spawnPowerUps(); // Spawns new power-ups.
      powerUpTimer = 0; // Resets the power-up timer.
    }
  
    // Handles bullet-target collisions.
    bullets.forEach(b => {
      // Skips inactive bullets.
      if (!b.active) return;
  
      // Checks each target for collision.
      targets.forEach(t => {
        // Determines the size based on the target type.
        const size = t.type === 'plane' ? enemyPlaneSize : t.type === 'fly' ? flySize : t.type === 'kamikaze' ? kamikazeSize : bossFlySize;
  
        // Checks for collision between bullet and target.
        if (t.hp > 0 && b.x > t.x && b.x < t.x + size && b.y > t.y && b.y < t.y + size) {
          t.hp--; // Reduces the target’s HP.
          b.active = false; // Deactivates the bullet.
  
          // Awards score and spawns power-up if the target is defeated.
          if (t.hp <= 0) {
            players[b.owner].score += t.type === 'plane' ? 20 : t.type === 'fly' ? 10 : t.type === 'kamikaze' ? 10 : 50;
            if (t.type === 'bossFly') {
              const randomPowerUp = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
              powerUps.push({ x: t.x, y: t.y, type: randomPowerUp.effect, name: randomPowerUp.name });
            }
          }
        }
      });
    });
  
    // Handles power-up collection.
    powerUps.forEach((p, i) => {
      // Checks for collision between player and power-up.
      if (player.x < p.x + powerUpSize && player.x + playerSize > p.x && player.y < p.y + powerUpSize && player.y + playerSize > p.y) {
        // Applies the power-up effect to the player.
        player.powerUp = p.type;
        player.powerUpTime = powerUpTypes.find(pt => pt.effect === p.type).duration;
        player.powerUpName = p.name;
        player.glowTime = 30; // Triggers a glow effect for 0.5 seconds.
  
        // Clears all power-ups and resets the timer.
        powerUps.length = 0;
        powerUpTimer = 0;
  
        // Logs the collected power-up for debugging.
        // console.log(`Power-up collected: ${p.name}`);
        return; // Exits the loop after collection.
      }
    });
  
    // Handles target-player collisions and movement.
    targets.forEach(t => {
      // Processes only active targets.
      if (t.hp > 0) {
        // Determines the size based on the target type.
        const size = t.type === 'plane' ? enemyPlaneSize : t.type === 'fly' ? flySize : t.type === 'kamikaze' ? kamikazeSize : bossFlySize;
  
        // Checks for collision between player and target.
        if (player.x < t.x + size && player.x + playerSize > t.x && player.y < t.y + size && player.y + playerSize > t.y) {
          // Destroys the target and awards score if the guard power-up is active.
          if (player.powerUp === 'guard') {
            t.hp = 0;
            players[localPlayerId].score += t.type === 'plane' ? 20 : t.type === 'fly' ? 10 : t.type === 'kamikaze' ? 10 : 50;
            if (t.type === 'bossFly') {
              const randomPowerUp = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
              powerUps.push({ x: t.x, y: t.y, type: randomPowerUp.effect, name: randomPowerUp.name });
            }
          } else if (player.powerUp !== 'shield' && player.blinkTime === 0) {
            // Reduces player HP and score on collision, triggers blink, ends game if HP <= 0.
            player.hp -= t.type === 'kamikaze' ? 2 : 1;
            player.score -= window.negativeMarkingCollision;
            player.blinkTime = 60; // 1 second at 60 FPS.
            t.hp = 0;
            if (player.score < 0) player.score = 0;
            if (player.hp <= 0) endGame();
          }
        }
  
        // Calculates time-based speed factors for fly and boss fly movement.
        const timeFactor = frameCount / 10800;
        const flyBaseSpeed = 1 + timeFactor * 2;
        const flyChaos = 2 + timeFactor * 4;
  
        // Updates target movement based on type.
        if (t.type === 'plane') {
          t.x -= planeSpeed * scaleRatio; // Moves left at planeSpeed.
          t.y = t.baseY + Math.sin(frameCount * t.frequency + t.phase) * t.amplitude; // Applies sinusoidal movement.
        } else if (t.type === 'fly' || t.type === 'bossFly') {
          t.x -= (flyBaseSpeed + (Math.random() - 0.5) * flyChaos) * scaleRatio; // Moves left with random variation.
          t.y += (Math.random() - 0.5) * flyChaos * 2 * scaleRatio; // Adds random vertical movement.
        } else if (t.type === 'kamikaze') {
          // Moves toward the player.
          const dx = t.targetX - t.x;
          const dy = t.targetY - t.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance > 5) {
            t.x += (dx / distance) * 5 * scaleRatio;
            t.y += (dy / distance) * 5 * scaleRatio;
          }
  
          // Fires a drone bullet every 180 frames (3 seconds).
          t.shootTimer++;
          if (t.shootTimer >= 180) {
            droneBullets.push({ x: t.x, y: t.y + kamikazeSize / 2 - droneBulletSize / 2, active: true });
            t.shootTimer = 0;
          }
        }
  
        // Clamps the target’s Y position within canvas bounds.
        if (t.y < 0) t.y = 0;
        if (t.y > window.baseHeight - size) t.y = window.baseHeight - size;
  
        // Resets the target’s X position to spawnX if it leaves the left boundary.
        if (t.x < -size) t.x = spawnX;
      }
    });
  
    // Handles drone bullet-player collisions.
    droneBullets.forEach(db => {
      // Checks for collision between player and drone bullet if active.
      if (db.active && player.x < db.x + droneBulletSize && player.x + playerSize > db.x && player.y < db.y + droneBulletSize && player.y + playerSize > db.y) {
        // Reduces HP and score if not shielded and not blinking, ends game if HP <= 0.
        if (player.powerUp !== 'shield' && player.blinkTime === 0) {
          player.hp -= 1;
          player.score -= window.negativeMarkingCollision;
          player.blinkTime = 60; // 1 second at 60 FPS.
          if (player.score < 0) player.score = 0;
          if (player.hp <= 0) endGame();
        }
  
        // Deactivates the drone bullet on collision.
        db.active = false;
      }
    });
  
    // Increments the frame count for timing and animation.
    frameCount++;
  }
  
  // Expose game logic functions to the window object
  window.fireBullet = fireBullet;
  window.spawnPowerUps = spawnPowerUps;
  window.update = update;