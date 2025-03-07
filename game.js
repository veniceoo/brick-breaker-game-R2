// 🎨 RWD 繽紛打磚塊遊戲 - 可在瀏覽器與手機上運行
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
document.body.appendChild(canvas);

// 設定畫布大小，自適應 RWD
function resizeCanvas() {
    canvas.width = window.innerWidth * 0.9;
    canvas.height = window.innerHeight * 0.8;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

document.body.style.margin = 0;
document.body.style.overflow = "hidden";
document.body.style.backgroundColor = "black";

// 球拍
const paddle = {
    width: canvas.width * 0.2,
    height: 15,
    x: (canvas.width - canvas.width * 0.2) / 2,
    y: canvas.height - 50,
    speed: 8,
    dx: 0
};

// 球
const ball = {
    x: canvas.width / 2,
    y: canvas.height - 100,
    radius: 12,
    speed: 4,
    dx: 3,
    dy: -3,
    color: "white"
};

// 磚塊設置
const brickRowCount = 6;
const brickColumnCount = 10;
const brickWidth = (canvas.width - 60) / brickColumnCount;
const brickHeight = 25;
const brickPadding = 10;
const brickOffsetTop = 50;
const brickOffsetLeft = 30;
const colors = ["#FF5733", "#FFC300", "#36D1DC", "#FF33A6", "#00E676", "#F06292"];

const bricks = [];
for (let row = 0; row < brickRowCount; row++) {
    bricks[row] = [];
    for (let col = 0; col < brickColumnCount; col++) {
        bricks[row][col] = {
            x: col * (brickWidth + brickPadding) + brickOffsetLeft,
            y: row * (brickHeight + brickPadding) + brickOffsetTop,
            status: 1,
            color: colors[row % colors.length]
        };
    }
}

// 監聽鍵盤事件
window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") paddle.dx = paddle.speed;
    else if (e.key === "ArrowLeft") paddle.dx = -paddle.speed;
});
window.addEventListener("keyup", () => {
    paddle.dx = 0;
});

// 手機觸控支援
canvas.addEventListener("touchmove", (e) => {
    let touchX = e.touches[0].clientX;
    paddle.x = touchX - paddle.width / 2;
    if (paddle.x < 0) paddle.x = 0;
    if (paddle.x + paddle.width > canvas.width) paddle.x = canvas.width - paddle.width;
    e.preventDefault();
});

let gameLoopId;
let gameOver = false; // 確保 Game Over 只發生一次

// 更新遊戲邏輯
function update() {
    if (gameOver) return;
    
    paddle.x += paddle.dx;
    if (paddle.x < 0) paddle.x = 0;
    if (paddle.x + paddle.width > canvas.width) paddle.x = canvas.width - paddle.width;
    
    ball.x += ball.dx;
    ball.y += ball.dy;
    
    if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
        ball.dx *= -1;
    }
    if (ball.y - ball.radius < 0) {
        ball.dy *= -1;
    }
    if (ball.y + ball.radius > canvas.height) {
        gameOver = true;
        cancelAnimationFrame(gameLoopId); // 停止遊戲迴圈
        setTimeout(() => {
            alert("Game Over!");
            document.location.reload(); // 3秒後重新開始遊戲
        }, 100);
        return;
    }
    
    if (ball.x > paddle.x && ball.x < paddle.x + paddle.width && ball.y + ball.radius > paddle.y) {
        ball.dy *= -1;
    }
    
    bricks.forEach((row) => {
        row.forEach((brick) => {
            if (brick.status === 1) {
                if (
                    ball.x > brick.x &&
                    ball.x < brick.x + brickWidth &&
                    ball.y - ball.radius < brick.y + brickHeight &&
                    ball.y + ball.radius > brick.y
                ) {
                    ball.dy *= -1;
                    brick.status = 0;
                }
            }
        });
    });
}

// 渲染畫面
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    bricks.forEach((row) => {
        row.forEach((brick) => {
            if (brick.status === 1) {
                ctx.fillStyle = brick.color;
                ctx.fillRect(brick.x, brick.y, brickWidth, brickHeight);
                ctx.strokeStyle = "white";
                ctx.strokeRect(brick.x, brick.y, brickWidth, brickHeight);
            }
        });
    });
    
    ctx.fillStyle = "white";
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    
    ctx.fillStyle = ball.color;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
}

// 遊戲循環
function gameLoop() {
    update();
    draw();
    gameLoopId = requestAnimationFrame(gameLoop);
}

gameLoop();
