// Section: DOM Elements with Error Checking
// Retrieves the <canvas id="gameCanvas"> element from the HTML and assigns it to a constant variable for use in rendering the game.
const canvas = document.getElementById('gameCanvas');

// Gets the 2D rendering context of the canvas for drawing game elements (e.g., player, bullets, background).
const ctx = canvas.getContext('2d');

// Retrieves the <div id="leaderboard"> element from the HTML (currently unused due to leaderboard removal, but included for reference).
// const leaderboard = document.getElementById('leaderboard');

// Retrieves the <ul id="leaderboardList"> element from the HTML (currently unused due to leaderboard removal, intended for displaying leaderboard entries).
// const leaderboardList = document.getElementById('leaderboardList');

// Retrieves the <div id="startScreen"> element from the HTML, used as the initial game screen, styled in CSS with 'position: fixed' and 'z-index: 100'.
const startScreen = document.getElementById('startScreen');

// Retrieves the <input id="playerNameInput"> element from the HTML, used to capture the player’s name, styled in CSS with 'border: 3px solid #FF4500'.
const playerNameInput = document.getElementById('playerNameInput');

// Retrieves the <button id="startGame"> element from the HTML, triggers game start, styled in CSS with a gradient background and hover effects.
const startGameButton = document.getElementById('startGame');

// Retrieves the <div id="endGamePopup"> element from the HTML, displays the game-over screen, styled in CSS with 'display: none' initially.
const endGamePopup = document.getElementById('endGamePopup');

// Retrieves the <p id="finalScore"> element inside #endGamePopup from the HTML, shows the final score, styled in CSS with 'font-size: 24px'.
const finalScoreDisplay = document.getElementById('finalScore');

// Retrieves the <button id="playAgain"> element inside #endGamePopup from the HTML, restarts the game, styled in CSS with a green gradient.
const playAgainButton = document.getElementById('playAgain');

// Retrieves the <button id="pauseResumeButton"> element from the HTML, toggles pause/resume, styled in CSS with 'position: fixed' and a gradient.
const pauseResumeButton = document.getElementById('pauseResumeButton');

// Retrieves the <button id="resetButton"> element from the HTML, resets the game, styled in CSS with 'position: fixed' and a gradient.
const resetButton = document.getElementById('resetButton');

// Retrieves the <button id="toggleControls"> element from the HTML, switches control mode, styled in CSS with 'position: fixed' and a purple gradient.
const toggleControlsButton = document.getElementById('toggleControls');

// Retrieves the <button id="fullscreenButton"> element from the HTML, toggles fullscreen, styled in CSS with 'display: none' initially and a blue gradient.
const fullscreenButton = document.getElementById('fullscreenButton');

// Checks if any required DOM elements are null (not found in HTML), logging an error with details if any are missing to aid debugging.
if (!canvas || !startScreen || !playerNameInput || !startGameButton || !endGamePopup || !finalScoreDisplay || !playAgainButton || !pauseResumeButton || !resetButton || !toggleControlsButton || !fullscreenButton) {
  console.error('One or more DOM elements not found:', {
    canvas, startScreen, playerNameInput, startGameButton, endGamePopup, finalScoreDisplay, playAgainButton, pauseResumeButton, resetButton, toggleControlsButton, fullscreenButton
  });
}

// Section: Image Assets (Local Files with updated paths)
// Creates a new Image object for the bullet sprite, with the source set to '/imgs/arrow.webp' (assumes this file exists in the imgs folder).
const bulletImg = new Image(); bulletImg.src = '/imgs/arrow.webp';

// Creates a new Image object for the enemy airship sprite, sourced from '/imgs/enemy-plane.webp'.
const enemyAirshipImg = new Image(); enemyAirshipImg.src = '/imgs/enemy-plane.webp';

// Creates a new Image object for the fly enemy sprite, sourced from '/imgs/fly.webp'.
const flyImg = new Image(); flyImg.src = '/imgs/fly.webp';

// Creates a new Image object for the player airship sprite, sourced from '/imgs/player-plane.webp'.
const myAirshipImg = new Image(); myAirshipImg.src = '/imgs/player-plane.webp';

// Creates a new Image object for the power-up sprite, sourced from '/imgs/power-up.webp'.
const powerUpImg = new Image(); powerUpImg.src = '/imgs/power-up.webp';

// Creates a new Image object for the background image, sourced from '/imgs/bg-img.webp'.
const backgroundImg = new Image(); backgroundImg.src = '/imgs/bg-img.webp';

// Creates a new Image object for the kamikaze drone sprite, sourced from '/imgs/drones.webp'.
const kamikazeImg = new Image(); kamikazeImg.src = '/imgs/drones.webp';

// Creates a new Image object for the boss fly sprite, sourced from '/imgs/boss-fly.webp'.
const bossFlyImg = new Image(); bossFlyImg.src = '/imgs/boss-fly.webp';

// Creates a new Image object for the drone bullet sprite, sourced from '/imgs/turret-bullet.webp'.
const droneBulletImg = new Image(); droneBulletImg.src = '/imgs/turret-bullet.webp';

// Section: Constants
// Defines the player movement speed in pixels per frame, used in update() for touch controls.
const playerSpeed = 8;

// Defines the bullet movement speed in pixels per frame, used in fireBullet() and update().
const bulletSpeed = 15;

// Defines the player airship size in pixels, used for collision detection and drawing in draw().
const playerSize = 40;

// Defines the enemy plane size in pixels, used for collision detection and drawing in draw().
const enemyPlaneSize = 35;

// Defines the fly enemy size in pixels, used for collision detection and drawing in draw().
const flySize = 25;

// Defines the kamikaze drone size in pixels, used for collision detection and drawing in draw().
const kamikazeSize = 40;

// Defines the boss fly size in pixels, used for collision detection and drawing in draw().
const bossFlySize = 50;

// Defines the bullet size in pixels, used for drawing in draw().
const bulletSize = 13;

// Defines the drone bullet size in pixels, used for drawing in draw().
const droneBulletSize = 8;

// Defines the power-up size in pixels, used for collision detection and drawing in draw().
const powerUpSize = 35;

// Defines the width of the HP bar in pixels, used for drawing in draw().
const hpBarWidth = 90;

// Defines the height of the HP bar in pixels, used for drawing in draw().
const hpBarHeight = 10;

// Section: Canvas Setup
// Initializes a scaling ratio for responsive canvas sizing, adjusted in resizeCanvas().
let scaleRatio = 1;

// Sets the base canvas width in pixels (1366px), used as a reference for scaling and positioning.
let baseWidth = 1366;

// Sets the base canvas height in pixels (720px), used as a reference for scaling and positioning.
let baseHeight = 720;

// Initializes the horizontal offset for centering the canvas, calculated in resizeCanvas().
let offsetX = 0;

// Initializes the vertical offset for centering the canvas, calculated in resizeCanvas().
let offsetY = 0;

// Defines an array of power-up types with names, effects, and durations (in frames), used in spawnPowerUps() and update().
const powerUpTypes = [
  { name: 'Rapid Fire', effect: 'rapid', duration: 5 * 60 }, // 5 seconds at 60 FPS
  { name: 'Invincibility', effect: 'shield', duration: 5 * 60 }, // 5 seconds at 60 FPS
  { name: 'Burst', effect: 'burst', duration: 5 * 60 }, // 5 seconds at 60 FPS
  { name: 'Power Guard', effect: 'guard', duration: 5 * 60 } // 5 seconds at 60 FPS
];

// Initializes the player’s name as an empty string, updated when the game starts.
let playerName = '';

// Defines an object to store player data, with a single 'solo' player initialized at the center of the canvas.
const players = { 'solo': { x: baseWidth / 2 - playerSize / 2, y: baseHeight / 2 - playerSize / 2, score: 0, powerUp: null, powerUpTime: 0, hp: 3, blinkTime: 0, name: playerName, glowTime: 0 } };

// Initializes an empty array to store bullet objects, updated in fireBullet() and drawn in draw().
const bullets = [];

// Initializes an empty array to store target (enemy) objects, updated in update() and drawn in draw().
const targets = [];

// Initializes an empty array to store power-up objects, updated in spawnPowerUps() and drawn in draw().
const powerUps = [];

// Initializes an empty array to store drone bullet objects, updated in update() and drawn in draw().
const droneBullets = [];

// Defines the local player ID as 'solo', used to access the single player object in players.
const localPlayerId = 'solo';

// Initializes a timer for power-up spawning, incremented in update() and reset in spawnPowerUps().
let powerUpTimer = 0;

// Initializes a timer for boss spawning, incremented in update() and reset when a boss appears.
let bossTimer = 0;

// Initializes a timer for wave progression, incremented in update() and reset every 1800 frames.
let waveTimer = 0;

// Initializes the wave count, incremented in update() when a new wave starts.
let waveCount = 0;

// Initializes a frame counter, incremented in update() for timing and animation purposes.
let frameCount = 0;

// Determines the initial control mode based on the user agent (touch for mobile, mouse for desktop), used in input handling.
// Replaced by inputMode which will be set dynamically based on first user input.
let controlMode = /Mobi|Android/i.test(navigator.userAgent) ? 'touch' : 'mouse';
// Logs the initial control mode to the console for debugging (will be overridden by inputMode).
// console.log('Initial controlMode (user agent):', controlMode);

// Initializes a flag to track if the game has started, set to true in startGameButton’s click handler.
let gameStarted = false;

// Initializes a buffer period for wave transitions, decremented in update().
let waveBuffer = 0;

// Initializes a counter for wave transition blinking, incremented in update().
let waveBlinkCounter = 0;

// Initializes a flag to track if the game is paused, toggled by pauseResumeButton.
let isPaused = false;

// Initializes a flag to track joystick activity for touch controls.
let joystickActive = false;

// Initializes the base X coordinate for the joystick, set in touchstart.
let joystickBaseX = 0;

// Initializes the base Y coordinate for the joystick, set in touchstart.
let joystickBaseY = 0;

// Initializes the current X coordinate for the joystick, updated in touchmove.
let joystickMoveX = 0;

// Initializes the current Y coordinate for the joystick, updated in touchmove.
let joystickMoveY = 0;

// Initializes a flag to track fire activity for touch controls.
let fireActive = false;

// Negative scoring for hitting other targets and drone bullets
const negativeMarkingCollision = 10

// Tracks whether the game is in mouse mode or touch mode, initialized as undefined until first input is detected.
// This replaces controlMode and will be set dynamically in input.js.
let inputMode = undefined; // 'mouse' or 'touch'

// Expose all globals to the window object for access in other scripts
window.canvas = canvas;
window.ctx = ctx;
window.startScreen = startScreen;
window.playerNameInput = playerNameInput;
window.startGameButton = startGameButton;
window.endGamePopup = endGamePopup;
window.finalScoreDisplay = finalScoreDisplay;
window.playAgainButton = playAgainButton;
window.pauseResumeButton = pauseResumeButton;
window.resetButton = resetButton;
window.toggleControlsButton = toggleControlsButton;
window.fullscreenButton = fullscreenButton;
window.bulletImg = bulletImg;
window.enemyAirshipImg = enemyAirshipImg;
window.flyImg = flyImg;
window.myAirshipImg = myAirshipImg;
window.powerUpImg = powerUpImg;
window.backgroundImg = backgroundImg;
window.kamikazeImg = kamikazeImg;
window.bossFlyImg = bossFlyImg;
window.droneBulletImg = droneBulletImg;
window.playerSpeed = playerSpeed;
window.bulletSpeed = bulletSpeed;
window.playerSize = playerSize;
window.enemyPlaneSize = enemyPlaneSize;
window.flySize = flySize;
window.kamikazeSize = kamikazeSize;
window.bossFlySize = bossFlySize;
window.bulletSize = bulletSize;
window.droneBulletSize = droneBulletSize;
window.powerUpSize = powerUpSize;
window.hpBarWidth = hpBarWidth;
window.hpBarHeight = hpBarHeight;
window.powerUpTypes = powerUpTypes;
window.playerName = playerName;
window.players = players;
window.bullets = bullets;
window.targets = targets;
window.powerUps = powerUps;
window.droneBullets = droneBullets;
window.localPlayerId = localPlayerId;
window.powerUpTimer = powerUpTimer;
window.bossTimer = bossTimer;
window.waveTimer = waveTimer;
window.waveCount = waveCount;
window.frameCount = frameCount;
window.controlMode = controlMode; // Kept for backward compatibility, though overridden by inputMode
window.gameStarted = gameStarted;
window.waveBuffer = waveBuffer;
window.waveBlinkCounter = waveBlinkCounter;
window.isPaused = isPaused;
window.joystickActive = joystickActive;
window.joystickBaseX = joystickBaseX;
window.joystickBaseY = joystickBaseY;
window.joystickMoveX = joystickMoveX;
window.joystickMoveY = joystickMoveY;
window.fireActive = fireActive;
window.inputMode = inputMode; // New global for input mode  
window.scaleRatio = scaleRatio;
window.baseWidth = baseWidth;
window.baseHeight = baseHeight;
window.offsetX = offsetX;
window.offsetY = offsetY;
window.negativeMarkingCollision = negativeMarkingCollision