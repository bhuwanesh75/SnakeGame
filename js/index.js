let inputDirection = { x: 0, y: 0 };
const foodSound = new Audio('../music/food.mp3');
const gameOverSound = new Audio('../music/gameOver.mp3');
const moveSound = new Audio('../music/move.mp3');
let lastPaintTime = 0;
let speed = 5;
var gamePause = false;
let snakeArray = [
    { x: 10, y: 10 }
];
let foodposition = { x: 5, y: 5 };
var score = 0;
let hiscore = localStorage.getItem("hiscore");
if(hiscore===null){
    localStorage.setItem("hiscore",JSON.stringify(0))
}
else{
    hScoreBox.innerHTML = `High Score : ${JSON.parse(hiscore)}`;
}

// this function is used to render screen after every 0.5secs
function main(ctime) {
    window.requestAnimationFrame(main);

    if (((ctime - lastPaintTime) / 1000 < 1 / speed) || gamePause) return;
    // console.log(ctime);
    lastPaintTime = ctime;
    if(score>hiscore){
        hiscore = score;
        localStorage.setItem("hiscore",JSON.stringify(score))
        hScoreBox.innerHTML = `High Score : ${JSON.parse(hiscore)}`;
    }
    Score.innerHTML = `Score : ${score}`
    gameEngine();
}

// function for checking if snake has collided to any wall
function isGameOver(sarray) {
    let max = 20;
    let min = 0;
    for (let j = 1; j < sarray.length; j++) {
        if (sarray[j].x === sarray[0].x && sarray[j].y === sarray[0].y) {
            console.log('inloop');
            return true;
        }
    }
    if (sarray[0].x >= max || sarray[0].x <= min || sarray[0].y >= max || sarray[0].y <= min) return true;
    return false;
}

// this function is used to display game and update the values
function gameEngine() {
    // part 1 -> updating the snake array and food
    // checking if there is any collision
    if (isGameOver(snakeArray)) {
        gameOverSound.play();
        alert("Game Over !! Press any key to play again...");
        inputDirection = { x: 0, y: 0 };
        snakeArray = [{ x: 10, y: 10 }];
        score = 0;
    }

    // if snake has eaten food, increment the score and increase size of snake and regenerate food
    if (snakeArray[0].x === foodposition.x && snakeArray[0].y === foodposition.y) {
        // foodSound.play();
        snakeArray.unshift({ x: snakeArray[0].x + inputDirection.x, y: snakeArray[0].y + inputDirection.y });
        let max = 18;
        let min = 2;
        foodposition = { x: Math.round(min + (max - min) * Math.random()), y: Math.round(min + (max - min) * Math.random()) };
        score++;
    }

    // moving the snake
    for (let i = snakeArray.length - 2; i >= 0; i--) {
        snakeArray[i + 1] = { ...snakeArray[i] } //we use here triple dots to use pass by value instead of reference
    }
    snakeArray[0].x += inputDirection.x;
    snakeArray[0].y += inputDirection.y;

    // part 2 -> displaying the snake and food
    // displaying Snake
    board.innerHTML = '';
    snakeArray.forEach((e, index) => {
        let snake = document.createElement('div');
        if (index === 0) snake.classList.add('shead');
        else snake.classList.add('sbody');
        snake.style.gridColumnStart = e.x;
        snake.style.gridRowStart = e.y;
        board.appendChild(snake);
    })

    // displaying Food
    let food = document.createElement('div');
    food.classList.add('food');
    food.style.gridColumnStart = foodposition.x;
    food.style.gridRowStart = foodposition.y;
    board.appendChild(food);

}


// Main logic
window.requestAnimationFrame(main); // it is used instead of setinterval to minimize the shear and flicker while changing frames
document.addEventListener('keydown', (e) => {
    console.log(e.key);
    // moveSound.play();
    switch (e.key) {
        case 'ArrowRight':
            inputDirection.x = 1;
            inputDirection.y = 0;
            break;
        case 'ArrowLeft':
            inputDirection.x = -1;
            inputDirection.y = 0;
            break;
        case 'ArrowDown':
            inputDirection.x = 0;
            inputDirection.y = 1;
            break;
        case 'ArrowUp':
            inputDirection.x = 0;
            inputDirection.y = -1;
            break;
        case ' ':
            gamePause = gamePause ? false : true;
            break;
        case '+':
            speed+=2;
            break;
        case '-':
            speed-=2;
            break;

        default:
            break;
    }
})