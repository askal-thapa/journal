// Game Variables
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const infiniteModeCheckbox = document.getElementById('infiniteMode');

// UI Elements
const startScreen = document.getElementById('startScreen');
const gameOverScreen = document.getElementById('gameOverScreen');
const scoreDisplay = document.getElementById('scoreDisplay');
const currentScoreEl = document.getElementById('currentScore');
const bestScoreEl = document.getElementById('bestScore');
const overlayStartBtn = document.getElementById('overlayStartBtn');
const restartBtn = document.getElementById('restartBtn');

let frames = 0;
const DEGREE = Math.PI / 180;

// Game State
const state = {
    current: 0,
    getReady: 0,
    game: 1,
    over: 2
};

// Control the game (click or keypress)
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault(); // Prevent scrolling
        action();
    }
});

canvas.addEventListener('click', action);
overlayStartBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent canvas click trigger
    action();
});
restartBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    action();
});

function action() {
    switch (state.current) {
        case state.getReady:
            state.current = state.game;
            ui.update();
            break;
        case state.game:
            bird.flap();
            break;
        case state.over:
            resetGame();
            break;
    }
}

function resetGame() {
    bird.speed = 0;
    bird.rotation = 0;
    pipes.reset();
    score.value = 0;
    state.current = state.getReady;
    frames = 0;
    ui.update();
}

// Game Objects
const bird = {
    x: 50,
    y: 150,
    width: 34,
    height: 26,
    radius: 12,

    speed: 0,
    gravity: 0.25,
    jump: 4.6,
    rotation: 0,

    draw: function () {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        // Infinite mode glow
        if (infiniteModeCheckbox.checked) {
            ctx.beginPath();
            ctx.arc(0, 0, this.radius + 5, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(255, 215, 0, 0.4)";
            ctx.fill();
        }

        // Body
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = "#FFD700";
        ctx.fill();
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Eye
        ctx.fillStyle = "#FFF";
        ctx.beginPath();
        ctx.arc(6, -6, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#000";
        ctx.beginPath();
        ctx.arc(8, -6, 2, 0, Math.PI * 2);
        ctx.fill();

        // Beak
        ctx.fillStyle = "#FF4500";
        ctx.beginPath();
        ctx.moveTo(8, 2);
        ctx.lineTo(18, 6);
        ctx.lineTo(8, 10);
        ctx.fill();
        ctx.stroke();

        // Wing
        ctx.fillStyle = "#F0E68C";
        ctx.beginPath();
        ctx.ellipse(-5, 5, 8, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.restore();
    },

    update: function () {
        // If game is in get ready state, the bird flaps slowly
        if (state.current == state.getReady) {
            this.y = 150 - 10 * Math.cos(frames * 0.1); // Hover effect
            this.rotation = 0;
        } else {
            this.speed += this.gravity;
            this.y += this.speed;

            // Rotation based on speed
            if (this.speed < this.jump / 2) {
                this.rotation = -25 * DEGREE;
            } else {
                this.rotation += 1 * DEGREE;
                if (this.rotation > 90 * DEGREE) {
                    this.rotation = 90 * DEGREE;
                }
            }

            // Floor collision
            if (this.y + this.radius >= canvas.height - fg.h) {
                this.y = canvas.height - fg.h - this.radius;
                if (state.current == state.game) {
                    if (!infiniteModeCheckbox.checked) {
                        state.current = state.over;
                        ui.update();
                    } else {
                        // In infinite mode, bounce
                        this.speed = -this.jump / 2;
                    }
                }
            }

            // Ceiling collision
            if (this.y - this.radius <= 0) {
                this.y = this.radius;
                this.speed = 0;
            }
        }
    },

    flap: function () {
        this.speed = -this.jump;
    }
}

const background = {
    draw: function () {
        // Sky
        let gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, "#70c5ce");
        gradient.addColorStop(1, "#c2e9eb");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Distant Clouds
        ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
        ctx.beginPath();
        ctx.arc(50, 100, 30, 0, Math.PI * 2);
        ctx.arc(90, 100, 40, 0, Math.PI * 2);
        ctx.arc(130, 100, 30, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(250, 60, 25, 0, Math.PI * 2);
        ctx.arc(280, 70, 35, 0, Math.PI * 2);
        ctx.fill();

        // Cityscape Silhouette (simple rectangles)
        ctx.fillStyle = "#86c5da";
        // Only draw if we want a static background, can move it to fg if we want it to scroll slowly
        ctx.fillRect(20, canvas.height - fg.h - 100, 40, 100);
        ctx.fillRect(70, canvas.height - fg.h - 60, 30, 60);
        ctx.fillRect(150, canvas.height - fg.h - 120, 50, 120);
        ctx.fillRect(250, canvas.height - fg.h - 80, 40, 80);
    }
}

const fg = {
    h: 50, // Floor height
    x: 0,
    dx: 2,
    draw: function () {
        ctx.fillStyle = "#ded895";
        ctx.fillRect(this.x, canvas.height - this.h, canvas.width, this.h);
        ctx.fillRect(this.x + canvas.width, canvas.height - this.h, canvas.width, this.h);

        // Grass top with gradient
        let grassGrad = ctx.createLinearGradient(0, canvas.height - this.h, 0, canvas.height - this.h + 10);
        grassGrad.addColorStop(0, "#73bf2e");
        grassGrad.addColorStop(1, "#558c22");

        ctx.fillStyle = grassGrad;
        ctx.fillRect(this.x, canvas.height - this.h, canvas.width, 14);
        ctx.fillRect(this.x + canvas.width, canvas.height - this.h, canvas.width, 14);
    },
    update: function () {
        if (state.current == state.game) {
            this.x = (this.x - this.dx) % (canvas.width / 2); // Simple scrolling reset
            // Fix smoothly: logic needs improvement for seamless loop, simpler to just reset x
            if (this.x <= -canvas.width) this.x = 0;
            // Actually simpler:
            this.x -= this.dx;
            if (this.x <= -canvas.width) this.x = 0;
        }
    }
}

const pipes = {
    position: [],

    w: 52,
    h: 400,
    gap: 100,
    dx: 2,

    reset: function () {
        this.position = [];
    },

    draw: function () {
        for (let i = 0; i < this.position.length; i++) {
            let p = this.position[i];

            let topY = p.y;
            let bottomY = p.y + this.h + this.gap;

            // Pipe Gradient
            let pipeGrad = ctx.createLinearGradient(p.x, 0, p.x + this.w, 0);
            pipeGrad.addColorStop(0, "#558c22");
            pipeGrad.addColorStop(0.2, "#73bf2e");
            pipeGrad.addColorStop(0.5, "#9Ce659"); // Highlight
            pipeGrad.addColorStop(0.9, "#558c22");

            // Draw Top Pipe
            ctx.fillStyle = pipeGrad;
            ctx.fillRect(p.x, topY, this.w, this.h);
            ctx.strokeStyle = "#2d5a0c";
            ctx.strokeRect(p.x, topY, this.w, this.h);

            // Draw Bottom Pipe
            ctx.fillStyle = pipeGrad;
            ctx.fillRect(p.x, bottomY, this.w, this.h);
            ctx.strokeRect(p.x, bottomY, this.w, this.h);

            // Pipe Caps
            ctx.fillStyle = pipeGrad;
            ctx.fillRect(p.x - 2, topY + this.h - 24, this.w + 4, 24); // Top cap
            ctx.strokeRect(p.x - 2, topY + this.h - 24, this.w + 4, 24);

            ctx.fillRect(p.x - 2, bottomY, this.w + 4, 24); // Bottom cap
            ctx.strokeRect(p.x - 2, bottomY, this.w + 4, 24);

            // Cap detail lines
            ctx.fillStyle = "rgba(0,0,0,0.1)";
            ctx.fillRect(p.x, topY + this.h - 4, this.w, 2);
            ctx.fillRect(p.x, bottomY + 2, this.w, 2);
        }
    },

    update: function () {
        if (state.current !== state.game) return;

        // Add new pipe every 150 frames
        if (frames % 150 == 0) {
            this.position.push({
                x: canvas.width,
                y: -150 * (Math.random() + 1)
            });
        }

        for (let i = 0; i < this.position.length; i++) {
            let p = this.position[i];

            // Move pipe to the left
            p.x -= this.dx;

            let bottomPipeY = p.y + this.h + this.gap;

            // Collision Detection
            // Top Pipe
            if (bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w &&
                bird.y - bird.radius < p.y + this.h && bird.y + bird.radius > p.y) {
                if (!infiniteModeCheckbox.checked) {
                    state.current = state.over;
                    ui.update();
                }
            }
            // Bottom Pipe
            if (bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w &&
                bird.y + bird.radius > bottomPipeY && bird.y - bird.radius < bottomPipeY + this.h) {
                if (!infiniteModeCheckbox.checked) {
                    state.current = state.over;
                    ui.update();
                }
            }

            // remove pipes that go off screen
            if (p.x + this.w <= 0) {
                this.position.shift();

                // Increase Score
                score.value += 1;
                score.best = Math.max(score.value, score.best);
                localStorage.setItem("flappy_best", score.best);
                scoreDisplay.innerText = score.value;
            }
        }
    }
}

// Score Logic
const score = {
    best: localStorage.getItem("flappy_best") || 0,
    value: 0,
    draw: function () {
        // We now use HTML overlay for score, so no canvas drawing needed here
    }
}

// UI Manager
const ui = {
    update: function () {
        // Toggle visibility based on state
        if (state.current == state.getReady) {
            startScreen.classList.remove('hidden');
            gameOverScreen.classList.add('hidden');
            scoreDisplay.classList.add('hidden');
        }
        else if (state.current == state.game) {
            startScreen.classList.add('hidden');
            gameOverScreen.classList.add('hidden');
            scoreDisplay.classList.remove('hidden');
            scoreDisplay.innerText = score.value;
        }
        else if (state.current == state.over) {
            startScreen.classList.add('hidden');
            scoreDisplay.classList.add('hidden');
            gameOverScreen.classList.remove('hidden');

            // Update score card
            currentScoreEl.innerText = score.value;
            bestScoreEl.innerText = score.best;
        }
    }
}

// Draw Loop
function draw() {
    background.draw();
    pipes.draw();
    fg.draw();
    bird.draw();
}

// Update Loop
function update() {
    bird.update();
    fg.update();
    pipes.update();
}

// Main Loop logic
function loop() {
    update();
    draw();
    frames++;
    requestAnimationFrame(loop);
}

// Initialize UI
ui.update();
loop();
