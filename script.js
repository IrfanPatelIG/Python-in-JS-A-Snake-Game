const startOverlay = document.querySelector(".start-overlay")
const gameOverOverlay = document.querySelector(".game-over-overlay")
const startBtn = document.querySelector(".start-btn")
const restartBtn = document.querySelector(".restart-btn")
const gameOverMsgDiv = document.querySelector(".game-over-msg")
const gameBoard = document.querySelector(".game-board")
const crrScoreDiv = document.querySelector("#crr-score")
const highScoreDiv = document.querySelector("#high-score")
const modeSwitchBtn = document.querySelector("#mode-switch-btn")

const blockWidth = 40
const blockHeght = 40
const blocks = [];
let snake = [
    {x:3, y:3}, {x:3, y:4}, {x:3, y:5}
]

let intervalSpeed = 250
let direction = "ArrowRight"
let foodBlock = {x:3, y:7}
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
    // console.log("Food:", foodRow, foodCol, foodBlock)
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

function gameOverSnakeColor() {
    snake.forEach((segment) => {
        let snakeRow = segment.x
        let snakeCol = segment.y
        blocks[`${snakeRow}, ${snakeCol}`].classList.add("dead-snake")
    })
    clearInterval(renderInterval)
    gameOverOverlay.classList.add("game-over-overlay-display")
}

function initializeGame() {
    renderBlocks()
    renderSnake()
    renderFood()
    if (!localStorage.key("HighScore")) {
        localStorage.setItem("HighScore", highScore)
    }
    else {
        highScore = localStorage.getItem("HighScore")
    }
    highScoreDiv.innerHTML = highScore
}

// **** GAME Rendering Starts Here ****

initializeGame()

function renderGame(check=1) {
    if (check != 1) return
    let head = null

    if (direction === "ArrowRight") {
        head = {
            x: snake[0].x,
            y: snake[0].y + 1
        }
    }
    else if (direction === "ArrowLeft") {
        head = {
            x: snake[0].x, 
            y: snake[0].y - 1
        }
    }
    else if (direction === "ArrowUp") {
        head = {
            x: snake[0].x - 1, 
            y: snake[0].y
        }
    }
    else if (direction === "ArrowDown") {
        head = {
            x: snake[0].x + 1, 
            y: snake[0].y
        }
    }


    // Checking for GAME OVER
    if (snake.length >= 4) {
        for (let i=0; i<snake.length; i++) {
            if (head.x == snake[i].x && head.y == snake[i].y) {
                snakeBodyTouch = true;
                gameOverMsg = "You Touched Yourself!"
            }
        }
    }

    // Crossing the Border
    if (head.x < 0 || head.y < 0 || head.x >= rows || head.y >= cols) {
        if (score > highScore) {
            localStorage.setItem("HighScore", score)
        }
        score = 0
        console.log("Game Over")
        gameOverMsg = "You Tried to Cross the Game Border!"
        gameOverMsgDiv.innerHTML = gameOverMsg
        gameOverSnakeColor()
        return;
    }
    // Eating self
    else if (snakeBodyTouch) {
        if (score > highScore) {
            localStorage.setItem("HighScore", score)
        }
        snakeBodyTouch = false
        score = 0
        console.log("Game Over")
        gameOverMsgDiv.innerHTML = gameOverMsg
        gameOverSnakeColor()
        blocks[`${head.x}, ${head.y}`].classList.remove("dead-snake")
        return;
    }
    // All clear
    else {
        snake.forEach(segment => {
            blocks[`${segment.x}, ${segment.y}`].classList.remove("snake-block")
        })
        
        snake.unshift(head)
        snake.pop()

        if (head.x == food.x && head.y == food.y) {
            score += 10
            if (score % 50 === 0 && intervalSpeed > 80) {
                intervalSpeed -= 20
                console.log("Interval speed chnaged to", intervalSpeed, " and score", score)
            }
            else if (score > 800) {
                intervalSpeed = 40
            }
            crrScoreDiv.innerHTML = score
            if (score > highScore) {
                highScoreDiv.innerHTML = score
            }
            snake.unshift(head)
            foodBlock.classList.remove("food-block")
            renderFood()
        }
        
        renderSnake()
    }
}



// ***Event Listeners***

let renderInterval

function startBtnEvent() {
    if (localStorage.getItem("HighScore")) {
        highScore = localStorage.getItem("HighScore")
    }
    highScoreDiv.innerHTML = highScore

    startOverlay.classList.remove("start-overlay-display")
    clearInterval(renderInterval)
    renderInterval = setInterval(() => {
        renderGame()
    }, intervalSpeed);
}

function restartBtnEvent() {
    if (localStorage.getItem("HighScore")) {
        highScore = localStorage.getItem("HighScore")
    }
    highScoreDiv.innerHTML = highScore
    
    crrScoreDiv.innerHTML = score
    direction = "ArrowRight"
    snake.forEach(seg => {
        blocks[`${seg.x}, ${seg.y}`].classList.remove("snake-block")
        blocks[`${seg.x}, ${seg.y}`].classList.remove("dead-snake")
    })
    snake = [{x:3, y:3}, {x:3, y:4}, {x:3, y:5}]
    foodBlock.classList.remove("food-block")
    renderFood()
    gameOverOverlay.classList.remove("game-over-overlay-display")
    clearInterval(renderInterval)
    renderInterval = setInterval(() => {
        renderGame()
    }, intervalSpeed);
}

startBtn.addEventListener("click", startBtnEvent)

restartBtn.addEventListener("click", restartBtnEvent)

window.addEventListener("resize", () => {
    renderBlocks()
    renderFood()
})

modeSwitchBtn.addEventListener("click", () => {
    const isLight = document.body.classList.toggle("light-mode")
    modeSwitchBtn.innerHTML = isLight ? "Dark Mode" : "Light Mode"
    if (modeSwitchBtn.innerHTML == "Dark Mode") {
        modeSwitchBtn.classList.add("btn-light-mode")
    } else {
        modeSwitchBtn.classList.remove("btn-light-mode")
    }
})

const opposites = {
    ArrowUp : "ArrowDown",
    ArrowDown : "ArrowUp",
    ArrowRight : "ArrowLeft",
    ArrowLeft : "ArrowRight"
}
let AllowedKeys = ["ArrowUp", "ArrowDown", "ArrowRight", "ArrowLeft"]

document.addEventListener("keydown", (e) => {
    if (AllowedKeys.includes(e.key)) {
        e.preventDefault()
        if (opposites[direction] !== e.key) {
            direction = e.key
        }
    }

    if (e.key === "Enter") {
        if (startOverlay.classList.contains("start-overlay-display")) {
            startBtnEvent()
        } else if (gameOverOverlay.classList.contains("game-over-overlay-display")) {
            restartBtnEvent()
        }
    }
})