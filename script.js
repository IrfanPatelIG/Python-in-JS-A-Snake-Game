const startOverlay = document.querySelector(".start-overlay")
const gameOverOverlay = document.querySelector(".game-over-overlay")
const startBtn = document.querySelector(".start-btn")
const restartBtn = document.querySelector(".restart-btn")
const gameBoard = document.querySelector(".game-board")
const gameOverMsgDiv = document.querySelector(".game-over-msg")

const blockWidth = 40
const blockHeght = 40
const blocks = [];

let snake = [
    {x:3, y:3}, {x:3, y:4}, {x:3, y:5}
]

let direction = "ArrowRight"
let foodBlock = {x:0, y:0}
let score = 0, highScore = 0
let snakeBodyTouch = false
let gameOverMsg
let point = 10

let cols = Math.floor(gameBoard.clientWidth / blockWidth)
let rows = Math.floor(gameBoard.clientHeight / blockHeght)

// Initial Start Overlay Display
startOverlay.classList.add("start-overlay-display")

function calRCAgain() {
    cols = Math.floor(gameBoard.clientWidth / blockWidth)
    rows = Math.floor(gameBoard.clientHeight / blockHeght)
}

function renderBlocks() {
    gameBoard.innerHTML = ""
    calRCAgain();
    for (let i=0; i < rows; i++) {
        for (let j=0; j < cols; j++) {
            const block = document.createElement("div")
            block.classList.add("block")
            blocks[`${i}, ${j}`] = block
            gameBoard.appendChild(block)
        }
    }

}

function renderFood() {
    let foodRow = Math.floor(Math.random() * rows)
    let foodCol = Math.floor(Math.random() * cols)
    food = {x: foodRow, y: foodCol}
    foodBlock = blocks[`${foodRow}, ${foodCol}`]
    foodBlock.classList.add("food-block")
    console.log("Food:", foodRow, foodCol, foodBlock)
}

function renderSnake() {
    let snakeRow
    let snakeCol
    snake.forEach((segment) => {
        snakeRow = segment.x
        snakeCol = segment.y
        blocks[`${snakeRow}, ${snakeCol}`].classList.add("snake-block")
    })
}

// **** GAME Rendering Starts Here ****

renderBlocks()
renderSnake()
renderFood()

function renderGame() {
    let head = null

    if (direction === "ArrowRight") {
        head = {
            x: snake[0].x,
            y: snake[0].y + 1
        }
        // snake.push(head)
    }
    else if (direction === "ArrowLeft") {
        head = {
            x: snake[0].x, 
            y: snake[0].y - 1
        }
        // snake.unshift(head)
    }
    else if (direction === "ArrowUp") {
        head = {
            x: snake[0].x - 1, 
            y: snake[0].y
        }
        // snake.unshift(head)
    }
    else if (direction === "ArrowDown") {
        head = {
            x: snake[0].x + 1, 
            y: snake[0].y
        }
        // snake.unshift(head)
    }

    // Checking for GAME OVER
    if (snake.length > 3) {
        for (let i=0; i<snake.length; i++) {
            if (head.x == snake[i].x && head.y == snake[i].y) {
                snakeBodyTouch = true;
                gameOverMsg = "You Touched Yourself!"
                gameOverMsgDiv.innerHTML = gameOverMsg
            }
        }
    }

    if (head.x < 0 || head.y < 0 || head.x >= rows || head.y >= cols) {
        console.log("Game Over")
        gameOverMsg = "You Crossed the Game Border!"
        gameOverMsgDiv.innerHTML = gameOverMsg
        snake.forEach((segment) => {
            let snakeRow = segment.x
            let snakeCol = segment.y
            blocks[`${snakeRow}, ${snakeCol}`].classList.add("dead-snake")
        })
        clearInterval(renderInterval)
        gameOverOverlay.classList.add("game-over-overlay-display")
        return;
    }
    else if (snakeBodyTouch) {
        console.log("Game Over")
        snake.forEach((segment) => {
            let snakeRow = segment.x
            let snakeCol = segment.y
            blocks[`${snakeRow}, ${snakeCol}`].classList.add("dead-snake")
        })
        blocks[`${head.x}, ${head.y}`].classList.remove("dead-snake")
        clearInterval(renderInterval)
        gameOverOverlay.classList.add("game-over-overlay-display")
        return;
    }
    else {
        snake.forEach(segment => {
            blocks[`${segment.x}, ${segment.y}`].classList.remove("snake-block")
        })
        
        snake.unshift(head)
        snake.pop()

        if (head.x == food.x && head.y == food.y) {
            score += 10
            console.log(food.x, food.y)
            console.log("Score:", score)
            snake.unshift(head)
            foodBlock.classList.remove("food-block")
            renderFood()
        }
        
        renderSnake()
    }
}


startBtn.addEventListener("click", function(e) {
    startOverlay.classList.remove("start-overlay-display")
    renderInterval = setInterval(() => {
        renderGame()
    }, 300);
})

restartBtn.addEventListener("click", function(e) {
    direction = "ArrowRight"
    snake.forEach(seg => {
        blocks[`${seg.x}, ${seg.y}`].classList.remove("snake-block")
        blocks[`${seg.x}, ${seg.y}`].classList.remove("dead-snake")
    })
    snake = [{x:3, y:3}, {x:3, y:4}, {x:3, y:5}]
    foodBlock.classList.remove("food-block")
    renderFood()
    gameOverOverlay.classList.remove("game-over-overlay-display")
    renderInterval = setInterval(() => {
        renderGame()
    }, 300);
})

window.addEventListener("resize", () => {
    renderBlocks();
})

document.addEventListener("keydown", (e) => {
    if (e.key ===  "ArrowUp" || e.key === "ArrowDown" || e.key === "ArrowRight" || e.key === "ArrowLeft") {
        direction = e.key
    }
    console.log(direction)
})