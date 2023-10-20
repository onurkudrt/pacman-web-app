const canvas = document.getElementById("canvas");
const canvasContext = canvas.getContext('2d');

const pacmanFrames = document.getElementById("animations");
const ghostFrames = document.getElementById("ghosts");

let createRect = (x,y,width,height,color)=>{
    canvasContext.fillStyle = color;
    canvasContext.fillRect(x,y,width,height);
};

const fps = 30;
const oneBlockSize = 20;
const wallColor = "#342DCA";
const canvasColor = "#000000"
const wallSpaceWidth = oneBlockSize/1.8;
const wallOffset = (oneBlockSize - wallSpaceWidth)/2;
const wallInnerColor = "#000000"
let foodColor = "#FEB897"
let score = 0;
let ghosts = [];
let ghostCount = 4;
let lives = 3;
let foodCount = 0;
let gameInterval;


const DIRECTION_RIGHT = 4;
const DIRECTION_UP = 3;
const DIRECTION_LEFT = 2;
const DIRECTION_BOTTOM = 1;

let ghostLocations = [
    { x:0, y:0},
    { x:176, y:0},
    { x:0, y:121},
    { x:176, y:121}
];

let map = [
//   1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17 18 19 20 21
    [1, 1, 1, 1 ,1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // 1
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1], // 2
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1], // 3
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1], // 4
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1], // 5 
    [1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1], // 6 
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1], // 7
    [1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1], // 8
    [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0], // 9
    [1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1], // 10
    [1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1], // 11
    [1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1], // 12
    [0, 0, 0, 0, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 0, 0, 0, 0], // 13
    [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0], // 14
    [1, 1, 1, 1, 1 ,2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1], // 15
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1], // 16
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1], // 17
    [1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1], // 18
    [1, 1, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 1, 1], // 19
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1], // 20 
    [1, 2, 1, 1, 1 ,1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1], // 21
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1], // 22
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ,1, 1, 1, 1, 1, 1]  // 23
];


let randomTargetsForGhosts = [
    {x: 1* oneBlockSize, y: 1*oneBlockSize },
    {x: 1*oneBlockSize , y: (map.length -2) * oneBlockSize},
    {x: (map[0].length-2) * oneBlockSize , y: oneBlockSize},
    {x: (map[0].length-2)* oneBlockSize , y: (map.length - 2)*oneBlockSize}
];

let gameLoop = ()=>{
    draw(); 
    update();
};

let gameOver = ()=>{
    clearInterval(gameInterval);
    drawGameOver();
};

let drawGameOver = () => {
    canvasContext.font = "70px Emulogic";
    canvasContext.fillStyle = "red";
    canvasContext.fillText("GAME OVER!", 0, 250);
};


const colors = ["red", "yellow", "pink", "purple", "white" , "blue" , "orange"];
let counter = 0;

let drawWin = ()=>{
    if(counter == colors.length)
        counter = 0;
    canvasContext.font = "55px Emulogic";
    canvasContext.fillStyle = colors[counter++];
    canvasContext.fillText(" WINNER WINNER, ", -5 , 250);
    canvasContext.fillText(" CHICKEN DINNER !",-10 , 300);
};

let drawLives = ()=>{
    canvasContext.font = "30px Emulogic";
    canvasContext.fillStyle = "white";
    canvasContext.fillText("Lives: ",(map[0].length / 2)*oneBlockSize, oneBlockSize * (map.length + 2));
    for(let i = 0; i<lives; i++)
    {
        canvasContext.drawImage(
            pacmanFrames,
            2*oneBlockSize,
            0,
            oneBlockSize,
            oneBlockSize,
            (map[0].length / 1.45 + i)*oneBlockSize,
            oneBlockSize * (map.length + 1),
            oneBlockSize,
            oneBlockSize
        );
    }
};

let restartGame = () =>{
    createNewPacman();
    createGhosts();
    lives--;
    if(lives == 0)
    {
        gameOver();
    }
};

let  update = ()=>{
    pacman.moveProcess();
    pacman.eat();
    for(let i = 0; i<ghosts.length; i++)
    {
        ghosts[i].moveProcess();
    }
    if( pacman.checkGhostCollision() )
    {
        restartGame();
    }
    if(score === foodCount)
    {
        clearInterval(gameInterval);
        
        setInterval(()=>{
            drawWin();
        }, 100);
        
    }
    console.log(foodCount, score);
};

let drawFoods = () =>{
    for(let i = 0; i< map.length; i++)
    {
        for(let j = 0; j < map[0].length; j++)
            {
                if( map[i][j] == 2 )
                {
                    createRect(
                    j*oneBlockSize + oneBlockSize / 3,
                    i*oneBlockSize + oneBlockSize / 3,
                    oneBlockSize/3,
                    oneBlockSize/3,
                    foodColor);
                }
            }
    }
};


let drawScore = ()=>{
    canvasContext.font = "30px Emulogic";
    canvasContext.fillStyle = "yellow";
    canvasContext.fillText("Score: " + score, (map[0].length / 5)*oneBlockSize, (map.length+2)*oneBlockSize);
};

let drawGhosts = ()=>{
    for(let i = 0; i< ghosts.length; i++ )
    {
        ghosts[i].draw();
    }
};

let draw = ()=>{
    createRect(0,0,canvas.width,canvas.height, canvasColor);
    drawWalls();
    drawFoods();
    pacman.draw();
    drawScore();
    drawGhosts();
    drawLives();
};





let drawWalls = ()=>{
    for(let i =0; i<map.length;i++)
        for(let j = 0; j<map[0].length;j++)
            {
                  // then it is a wall
                if(map[i][j] == 1)
                {
                    createRect( j*oneBlockSize,
                                i*oneBlockSize,
                                oneBlockSize,
                                oneBlockSize,
                                wallColor);

                    if( j>0 && map[i][j-1] == 1)
                        createRect(j*oneBlockSize,
                                    i*oneBlockSize + wallOffset,
                                    wallOffset + wallSpaceWidth,
                                    wallSpaceWidth ,
                                    wallInnerColor);                   
                
                    if(j < map[0].length - 1 && map[i][j+1] == 1 )
                        createRect(j*oneBlockSize + wallOffset, 
                                    i*oneBlockSize + wallOffset,
                                    wallOffset + wallSpaceWidth,
                                    wallSpaceWidth ,
                                    wallInnerColor);
                   
                    if( i>0 && map[i-1][j] == 1)
                        createRect(j*oneBlockSize + wallOffset,
                            i*oneBlockSize,
                            wallSpaceWidth,
                            wallSpaceWidth + wallOffset,
                            wallInnerColor);
                    
                    if(i < map.length - 1 && map[i+1][j] == 1 )
                        createRect(j*oneBlockSize + wallOffset,
                                    i*oneBlockSize + wallOffset,
                                    wallSpaceWidth,
                                    wallSpaceWidth + wallOffset,
                                    wallInnerColor);
                }
            }
};

let createNewPacman = ()=>{
    pacman = new Pacman(
        oneBlockSize,
        oneBlockSize,
        oneBlockSize,
        oneBlockSize,
        oneBlockSize/5,

    );
}



let createGhosts = ()=>{
    ghosts = [];
    for(let i = 0; i<ghostCount; i++)
    {
        let newGhost = new Ghost(
            9*oneBlockSize + (i % 2 == 0 ? 0 : 1) * oneBlockSize,
            10*oneBlockSize + (i % 2 == 0 ? 0 : 1) * oneBlockSize,
            oneBlockSize,
            oneBlockSize,
            pacman.speed / 2,
            ghostLocations[ i%4 ].x,
            ghostLocations[ i%4 ].y,
            124,
            116,
            6 + i
        );
    ghosts.push(newGhost);
    }
}

const init = ()=>{
    
for( let i = 0; i < map.length; i++)
    for( let j = 0; j < map[0].length; j++)
        if(map[i][j] == 2)
            ++foodCount;
    
    createNewPacman();
    createGhosts();
    gameInterval =  setInterval(gameLoop, 1000 / fps);

};




window.addEventListener("keydown", (event) => {
    let k = event.keyCode;

    setTimeout(()=>{
        if(k == 37 || k == 65) // left
        {
            pacman.nextDirection = DIRECTION_LEFT;
        }
        else if (k == 38 || k == 87) // up
        {
            pacman.nextDirection = DIRECTION_UP;
        }
        else if(k == 39 || k == 68) // right
        {
            pacman.nextDirection = DIRECTION_RIGHT;
        }
        else if (k == 40 || k == 83) // bottom
        {
            pacman.nextDirection = DIRECTION_BOTTOM;
        }
    }, 1)
});




init();