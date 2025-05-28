console.log("脚本已加载！");
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 20; // 每个格子大小
const tileCount = canvas.width / gridSize;

let snake = [{ x: 10, y: 10 }];
let food = { x: 5, y: 5 };
let dx = 0;
let dy = 0;
let score = 0;
let gameInterval = null;

function draw() {
  // 清空画布
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 绘制蛇
  ctx.fillStyle = 'lime';
  for (let segment of snake) {
    ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
  }

  // 绘制食物
  ctx.fillStyle = 'red';
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);

  // 计算下一个头部位置
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };

  // 🔥 先判断是否撞墙或自己，再决定是否继续
  if (
    head.x < -1 || head.x >= tileCount+1 || 
    head.y < -1 || head.y >= tileCount+1 ||
    snake.some(seg => seg.x === head.x && seg.y === head.y)
  ) {
    alert('游戏结束！你的得分是：' + score);
    stopGame();
    return;
  }

  // 判断是否吃到食物
  if (head.x === food.x && head.y === food.y) {
    score++;
    placeFood();
  } else {
    snake.pop(); // 移除尾巴
  }

  // 添加新头
  snake.unshift(head); // 添加新头
}

function placeFood() {
  food.x = Math.floor(Math.random() * tileCount);
  food.y = Math.floor(Math.random() * tileCount);
}

function startGame() {
  if (!gameInterval) {
    gameInterval = setInterval(draw, 100);
  }
}

function stopGame() {
  if (gameInterval) {
    clearInterval(gameInterval);
    gameInterval = null;
  }
  snake = [{ x: 10, y: 10 }];
  dx = 0;
  dy = 0;
  score = 0;
  placeFood();
}

document.addEventListener('keydown', e => {
  // 如果还没开始游戏（即没有移动方向），则启动游戏
  if (dx === 0 && dy === 0) {
    switch (e.key) {
      case 'ArrowUp':
        dx = 0; dy = -1;
        break;
      case 'ArrowDown':
        dx = 0; dy = 1;
        break;
      case 'ArrowLeft':
        dx = -1; dy = 0;
        break;
      case 'ArrowRight':
        dx = 1; dy = 0;
        break;
    }
    startGame(); // 第一次按键触发游戏开始
  } else {
    // 已经开始，正常控制方向
    switch (e.key) {
      case 'ArrowUp':
        if (dy !== 1) { dx = 0; dy = -1; }
        break;
      case 'ArrowDown':
        if (dy !== -1) { dx = 0; dy = 1; }
        break;
      case 'ArrowLeft':
        if (dx !== 1) { dx = -1; dy = 0; }
        break;
      case 'ArrowRight':
        if (dx !== -1) { dx = 1; dy = 0; }
        break;
    }
  }
});

// 页面加载时初始化游戏状态
stopGame(); // 重置所有状态


