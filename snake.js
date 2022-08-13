console.log("Под лежечий камень вода не течет(c) Мать")

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let width = canvas.width;
let height = canvas.height;

let blockSize = 10;
let widthInBlocks = width / blockSize;
let heightInBlocks = height / blockSize;

let score = 0;

// рисуем рамку
function drawBorder () {
    ctx.fillStyle = "#0d044d";
    ctx.fillRect(0, 0, width, blockSize);
    ctx.fillRect(0, height - blockSize, width, blockSize); 
    ctx.fillRect(0, 0, blockSize, height);
    ctx.fillRect(width - blockSize, 0, blockSize, height);
};
drawBorder()


function drawScore () {
    ctx.font = "20px Courier";
    ctx.fillStyle = "Black";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Счет: " + score, blockSize, blockSize);
};
drawScore()

function gameOver () {
    playing = false;;
    ctx.font = "40px Comic Sans MS";
    ctx.fillStyle = "Black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Конец игры", width / 2, height / 2);
};

// let intervalId = 0

function Block (col, row) {
    this.col = col;
    this.row = row
}

let sampleBlock = new Block(5,5)


Block.prototype.drawSquare = function (color) {
    let x = this.col * blockSize
    let y = this.row * blockSize
    ctx.fillStyle = color
    ctx.fillRect(x, y, blockSize, blockSize)
}

// sampleBlock.drawSquare("Blue")

function circleFunction(x, y, radius, fillCircle) {
    ctx.beginPath()
    ctx.arc(x,y,radius, 0, Math.PI*2, false);
    if(fillCircle){
        ctx.fill()
    } else {
        ctx.stroke()
    }
    // ctx.fillStyle = color
}

Block.prototype.drawCircle = function(color) {
    let centerX = this.col * blockSize + blockSize/2;
    let centerY = this.row * blockSize + blockSize/2;
    ctx.fillStyle = color;
    circleFunction( centerX, centerY, blockSize/2, true)
}

// sampleBlock.drawCircle("green")

Block.prototype.equal = function(otherBlock) {
    return this.col === otherBlock.col && this.row === otherBlock.row;
}



let Snake = function() {
    this.segments = [
        new Block(7,5),
        new Block(6,5),
        new Block(5,5)
    ];
    this.direction = "right";
    this.nextDirection = "right"
}

Snake.prototype.draw = function() {
    for(let i = 0; i<this.segments.length; i++) {
        this.segments[i].drawSquare("Blue")

    }
}

let snake = new Snake()
snake.draw()

Snake.prototype.checkCollision = function (head) {
    let leftCollision = (head.col === 0);
    let topCollision = (head.row === 0);
    let rightCollision = (head.col === widthInBlocks-1);
    let bottomCollision = (head.row ===  heightInBlocks-1)

    let wallCollision = leftCollision || topCollision || rightCollision || bottomCollision;

    let selfCollision = false;

     
    for(let i = 0; i<this.segments.length; i++) {
       if (head.equal(this.segments[i])) {
        selfCollision = true
       }
    }
    return wallCollision || selfCollision
}



let Apple = function() {
    this.position = new Block(10, 10)
};

Apple.prototype.draw = function() {
    this.position.drawCircle("LimeGreen")
}
let apple = new Apple


Apple.prototype.move = function() {
    let randomCol = Math.floor(Math.random() *(widthInBlocks - 2)) + 1;
    let randomRow = Math.floor(Math.random() *(heightInBlocks - 2)) + 1;
    this.position = new Block(randomCol, randomRow);
}


Snake.prototype.move = function () {
  let head = this.segments[0];
  let newHead;
  this.direction = this.nextDirection;
  if (this.direction === "right") {
    newHead = new Block(head.col + 1, head.row);
  } else if (this.direction === "down") {
    newHead = new Block(head.col, head.row + 1);
  } else if (this.direction === "left") {
    newHead = new Block(head.col - 1, head.row);
  } else if (this.direction === "up") {
    newHead = new Block(head.col, head.row - 1);
  }
  if (this.checkCollision(newHead)) {
    gameOver();
    return;
  }

  this.segments.unshift(newHead);

  if (newHead.equal(apple.position)) {
    score++;
    animationTime -= 5
    apple.move(this.segments);
  } else {
    this.segments.pop();
  }

// this.segments.pop()

};

// setInterval( snake.move(), 30)



snake.move()

let directions = {
    37: "left",
    38: "up",
    39: "right",
    40: "down"
};

$("body").keydown(function(event){
    let newDirection = directions[event.keyCode];
    if (newDirection !== undefined) {
        snake.setDirection(newDirection)
    }
});

Snake.prototype.setDirection = function(newDirection){
    if (this.direction === "up" && newDirection === "down") {
        return
    } else if (this.direction === "right" && newDirection === "left") {
        return
    } else if (this.direction === "down" && newDirection === "up") {
        return
    } else if (this.direction === "left" && newDirection === "right") {
        return
    }
    this.nextDirection = newDirection
}



let playing = true;
    let animationTime = 100;

    // Create a game loop function, which will call itself using setTimeout
    var gameLoop = function () {
      ctx.clearRect(0, 0, width, height);
      drawScore();
      snake.move();
      snake.draw();
      apple.draw();
      drawBorder();

      // This is set to false by the gameOver function
      if (playing) {
        setTimeout(gameLoop, animationTime);
      }
    };

    // Start the game loop
    gameLoop();


    








