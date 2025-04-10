const gameContainer = document.getElementById('game-container');
const bird = document.getElementById('bird');
const scoreElement = document.getElementById('score-value');
const gameOverElement = document.getElementById('game-over');
const finalScoreElement = document.getElementById('final-score');
const restartButton = document.getElementById('restart-btn');

const containerHeight = gameContainer.offsetHeight;
const containerWidth = gameContainer.offsetWidth;

let birdY = containerHeight / 2;
let birdVelocity = 0;
let gravity = 0.2;
let jumpStrength = -5;

let pipes = [];
let pipeSpeed = 1;
let pipeGap = 150;

let score = 0;
let gameRunning = true;

// Handle jump
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && gameRunning) {
        birdVelocity = jumpStrength;
    }
});

// Update bird position
function updateBird() {
    birdVelocity += gravity;
    birdY += birdVelocity;

    if (birdY <= 0) {
        birdY = 0;
        birdVelocity = 0;
    }

    if (birdY >= containerHeight - bird.offsetHeight) {
        birdY = containerHeight - bird.offsetHeight;
        endGame();
    }

    bird.style.top = birdY + 'px';
}

// Create pipes
function createPipe() {
    const pipeHeight = Math.random() * (containerHeight - pipeGap - 50) + 25;
    const upperPipe = document.createElement('div');
    const lowerPipe = document.createElement('div');

    upperPipe.classList.add('pipe', 'upper');
    lowerPipe.classList.add('pipe');

    upperPipe.style.height = pipeHeight + 'px';
    lowerPipe.style.height = containerHeight - pipeHeight - pipeGap + 'px';
    lowerPipe.style.top = pipeHeight + pipeGap + 'px';

    upperPipe.style.left = containerWidth + 'px';
    lowerPipe.style.left = containerWidth + 'px';

    gameContainer.appendChild(upperPipe);
    gameContainer.appendChild(lowerPipe);

    pipes.push({ upperPipe, lowerPipe, passed: false });
}

// Update pipes
function updatePipes() {
    pipes.forEach((pipe, index) => {
        const upperPipe = pipe.upperPipe;
        const lowerPipe = pipe.lowerPipe;

        const pipeX = parseFloat(upperPipe.style.left);
        const newPipeX = pipeX - pipeSpeed;

        if (newPipeX + upperPipe.offsetWidth <= 0) {
            upperPipe.remove();
            lowerPipe.remove();
            pipes.splice(index, 1);
        } else {
            upperPipe.style.left = newPipeX + 'px';
            lowerPipe.style.left = newPipeX + 'px';

            // Check for collisions
            if (
                checkCollision(bird, upperPipe) ||
                checkCollision(bird, lowerPipe)
            ) {
                endGame();
            }

            // Update score
            if (!pipe.passed && newPipeX + upperPipe.offsetWidth < bird.offsetLeft) {
                pipe.passed = true;
                score++;
                if(score%5 == 0){
                    pipeSpeed +=.1
                }
                scoreElement.textContent = score;
            }
        }
    });

    // Spawn new pipes
    if (pipes.length === 0 || parseFloat(pipes[pipes.length - 1].upperPipe.style.left) < containerWidth - 200) {
        createPipe();
    }
}

// Collision detection using bounding boxes
function checkCollision(rect1, rect2) {
    const r1 = rect1.getBoundingClientRect();
    const r2 = rect2.getBoundingClientRect();

    return !(
        r1.top > r2.bottom ||
        r1.bottom < r2.top ||
        r1.left > r2.right ||
        r1.right < r2.left
    );
}

// End the game
function endGame() {
    gameRunning = false;

    // Show game-over screen
    finalScoreElement.textContent = score;
    gameOverElement.style.display = "block"
}

// Restart the game
restartButton.addEventListener('click', () => {
    // Reset variables
    birdY = containerHeight / 2;
    birdVelocity = 0;
    pipes.forEach((pipe) => {
        pipe.upperPipe.remove();
        pipe.lowerPipe.remove();
    });
    pipes = [];
    score = 0;
    scoreElement.textContent = score;

    // Hide game-over screen
    // gameOverElement.classList.add('hidden');
    gameOverElement.style.display = "none"
    gameRunning = true;

    createPipe();
    gameLoop();
});

// Game loop
function gameLoop() {
    if (!gameRunning) return;

    updateBird();
    updatePipes();

    requestAnimationFrame(gameLoop);
}

// Start the game
createPipe();
gameLoop();
gameOverElement.style.display = "none"


