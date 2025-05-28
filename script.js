console.log("脚本已加载！");
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [{ x: 10, y: 10 }];
let food = randomFood();
let dx = 0;
let dy = 0;
let score = 0;
let gameInterval = null;
let isPaused = false;

// DOM Elements
const scoreEl = document.getElementById("score");
const gameStatus = document.getElementById("gameStatus");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");
const dpadButtons = document.querySelectorAll(".dpad");

// 初始化分数
function updateScore() {
  scoreEl.textContent = score;
}

// 食物生成
function randomFood() {
  return {
    x: Math.floor(Math.random() * tileCount),
    y: Math.floor(Math.random() * tileCount)
  };
}

// 绘图函数
function draw() {
  if (isPaused) return;

  // Clear
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw Snake
  ctx.fillStyle = "lime";
  snake.forEach(part => {
    ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize - 2, gridSize - 2);
  });

  // Draw Food
  ctx.fillStyle = "red";
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);

  // Move Snake
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };

  // Check Collision
  if (
    head.x < 0 || head.x >= tileCount ||
    head.y < 0 || head.y >= tileCount ||
    snake.some(seg => seg.x === head.x && seg.y === head.y)
  ) {
    gameOver();
    return;
  }

  // Eat Food
  if (head.x === food.x && head.y === food.y) {
    score++;
    updateScore();
    food = randomFood();
  } else {
    snake.pop();
  }

  snake.unshift(head);
}

function stopGame() {
  if (gameInterval) {
    clearInterval(gameInterval);
    gameInterval = null;
  }

    isPaused = false;
  pauseBtn.textContent = "暂停";
}
// 游戏结束
function gameOver() {
  stopGame();
  gameStatus.textContent = `游戏结束！得分：${score}`;
}

// 启动游戏
function startGame() {
  if (!gameInterval) {
    gameInterval = setInterval(draw, 100);
    gameStatus.textContent = "";
  }
}

// 暂停游戏
function pauseGame() {
  isPaused = !isPaused;
  pauseBtn.textContent = isPaused ? "继续" : "暂停";
}

// 重置游戏
function resetGame() {
  // 重置蛇和方向
  snake = [{ x: 10, y: 10 }];
  dx = 0;
  dy = 0;

  // 重置分数
  score = 0;
  updateScore();

  // 重置食物
  food = randomFood();

  // 重置状态提示
  gameStatus.textContent = "";

  // 清除定时器
  if (gameInterval) {
    clearInterval(gameInterval);
    gameInterval = null;
  }

  // 恢复按钮状态
  pauseBtn.textContent = "暂停";
  isPaused = false;

  // 重新绘制一次画布
  draw();
}

// 键盘控制
let gameStarted = false;

document.addEventListener("keydown", e => {
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
    e.preventDefault(); // 阻止页面滚动
  }

  if (!gameStarted) {
    switch (e.key) {
      case "ArrowUp":
        dx = 0; dy = -1;
        break;
      case "ArrowDown":
        dx = 0; dy = 1;
        break;
      case "ArrowLeft":
        dx = -1; dy = 0;
        break;
      case "ArrowRight":
        dx = 1; dy = 0;
        break;
      default:
        return;
    }
    gameStarted = true;
    startGame(); // 第一次按键触发游戏开始
  } else {
    // 已经开始，正常控制方向
    switch (e.key) {
      case "ArrowUp":
        if (dy !== 1) { dx = 0; dy = -1; }
        break;
      case "ArrowDown":
        if (dy !== -1) { dx = 0; dy = 1; }
        break;
      case "ArrowLeft":
        if (dx !== 1) { dx = -1; dy = 0; }
        break;
      case "ArrowRight":
        if (dx !== -1) { dx = 1; dy = 0; }
        break;
    }
  }
});

// 按钮控制
dpadButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    if (!gameStarted) {
      const dir = btn.classList[1];
      switch (dir) {
        case "up": dx = 0; dy = -1; break;
        case "down": dx = 0; dy = 1; break;
        case "left": dx = -1; dy = 0; break;
        case "right": dx = 1; dy = 0; break;
      }
      gameStarted = true;
      startGame();
    } else {
      const dir = btn.classList[1];
      switch (dir) {
        case "up": if (dy !== 1) { dx = 0; dy = -1; } break;
        case "down": if (dy !== -1) { dx = 0; dy = 1; } break;
        case "left": if (dx !== 1) { dx = -1; dy = 0; } break;
        case "right": if (dx !== -1) { dx = 1; dy = 0; } break;
      }
    }
  });
});

// 按钮事件
startBtn.addEventListener("click", () => {
  if (dx === 0 && dy === 0) {
    dx = 1;
    dy = 0;
  }
  gameStarted = true; // 👈 必须设置为 true
  startGame();
});

pauseBtn.addEventListener("click", pauseGame);
resetBtn.addEventListener("click", resetGame);

updateScore();
