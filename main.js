let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");


let bird = new Image();
let bg = new Image();
let fg = new Image();
let pipeUp = new Image();
let pipeBottom = new Image();
let bodyPipe = new Image();

bird.src = "img/flappy_bird_bird.png";
bg.src = "img/flappy_bird_bg.png";
fg.src = "img/flappy_bird_fg.png";
pipeUp.src = "img/flappy_bird_pipeUp.png";
pipeBottom.src = "img/flappy_bird_pipeBottom.png";
bodyPipe.src = "img/flappy_bird_pipe.png";

let fly = new Audio();
let score_audio = new Audio();
  
[canvas.width, canvas.height] = [window.innerWidth, window.innerHeight]

fly.src = "audio/fly.mp3";
score_audio.src = "audio/score.mp3";

const btnRestart = {
    width: 290,
    height: 130,
}
btnRestart.x = canvas.width / 2 - btnRestart.width / 2
btnRestart.y = canvas.height / 2 - btnRestart.height / 2

let moveRight = false
let moveLeft = false
let moveDown = false
document.addEventListener('keydown', function(e){
    // alert(e.keyCode)
    if(isDied){ location.reload()
    } else if(e.keyCode === 68){moveRight = true}
      else if(e.keyCode === 65){moveLeft = true}
      else if(e.keyCode === 83){moveDown = true}
    else if(e.keyCode === 87 || e.keyCode === 32){ moveUp() }
})
document.addEventListener('keyup', function(e){
    if(e.keyCode === 68){moveRight = false}
    if(e.keyCode === 65){moveLeft = false}
    if(e.keyCode === 83){moveDown = false}
})

function moveUp() {
    fly.play();
    for(let i=0; i<60;i+=2){
        setTimeout(function(){ 
            yPos--
        }, 1 * i)
    }
}

let pipe = [];

pipe[0] = {
    x: canvas.width,
    y: 0
}

let score = 0;

let xPos = canvas.width / 2;
let yPos = 150;
let grav = 1;

let isDied = false
function draw() {
    const imgWidth = 310;

    for (let i = 0; i < Math.ceil(canvas.width /  imgWidth * (canvas.height / bg.height)); i++) {
        ctx.drawImage(bg,  imgWidth * (canvas.height / bg.height) * i, 0,  imgWidth * (canvas.height / bg.height), canvas.height);
    }
    for (let i = 0; i < pipe.length; i++) {
        ctx.drawImage(bodyPipe, pipe[i].x, 0, bodyPipe.width, pipe[i].y)
        ctx.drawImage(pipeUp, pipe[i].x, pipe[i].y); 

        ctx.drawImage(bodyPipe, pipe[i].x, (pipe[i].y + pipeUp.height) +  100, bodyPipe.width, canvas.height) 
        ctx.drawImage(pipeBottom, pipe[i].x, (pipe[i].y + pipeUp.height) +  100);

        pipe[i].x--;

        if (pipe[i].x == window.innerWidth - 300) {
            pipe.push({
                x: window.innerWidth,
                y: (Math.floor(Math.random() * pipeUp.height) - pipeUp.height) + 100
            });
        }

        if(moveRight){
            for(let i=0; i<2;i++){
                setTimeout(function(){ 
                    xPos+=0.5
                }, 1 * i)
            }
        }
        if(moveLeft){
            for(let i=0; i<2;i++){
                setTimeout(function(){ 
                    xPos-= 0.5
                }, 1 * i)
            }
        }
        if(moveDown){
            for(let i=0; i<2;i+=0.2){
                setTimeout(function(){ 
                    grav+=0.02
                }, 1 * i)
            }
        }
        if(!moveDown){ grav = 1 }

        if (
            // collisison with topper pipe
            (xPos + bird.width >= pipe[i].x && 
             xPos <= pipe[i].x + pipeUp.width && 
             yPos <= pipe[i].y + pipeUp.height) ||
            
            // collision with bottom pipe
            (xPos + bird.width >= pipe[i].x && 
             xPos <= pipe[i].x + pipeBottom.width && 
             yPos + bird.height >= pipe[i].y + pipeUp.height + 100) ||
            
            // collision with ground
            (yPos + bird.height >= canvas.height - fg.height)
        ) {
            isDied = true
            pipe = [];

            pipeUp.src = "img/flappy_bird_pipeUp.png";
            pipeBottom.src = "img/flappy_bird_pipeBottom.png";

            yPos = 600;

            document.onmousemove = function(e){
                if(e.clientX < btnRestart.x + btnRestart.width && e.clientX > btnRestart.x &&
                    e.clientY < btnRestart.y + btnRestart.height && e.clientY > btnRestart.y 
                ){
                    canvas.style.cursor = 'pointer'
                    ctx.fillStyle = '#333'

                    document.onclick = function(){
                        location.reload()
                    }
                } else {
                    document.onclick = null
                    canvas.style.cursor = 'auto'
                    ctx.fillStyle = 'black'
                }
            }

            pipeBottom.onload = null
        } 


        // if (pipe[i].x == 5) {
        //     score++;
        //     score_audio.play();
        // }
        if(xPos == pipe[i]){
            score++
            score_audio.play()
        }

    }
    if(isDied){
        ctx.drawImage(fg, 0, canvas.height - fg.height);
        ctx.font = `${canvas.height / 55}px Montserrat`
        ctx.fillText("Game Over", canvas.width / 2 - btnRestart.width / 6, canvas.height / 2 - btnRestart.height / 1.5);

        ctx.fillRect(btnRestart.x, btnRestart.y, btnRestart.width, btnRestart.height)
    }

    for(let i=0;i<Math.round(canvas.width / 310) + 1;i++){
        ctx.drawImage(fg, i * 310, canvas.height - fg.height);
    }
    if(moveLeft){
        ctx.save();
        ctx.translate((xPos + bird.width)+xPos, yPos/canvas.height);
        ctx.scale(-1, 1);
        ctx.drawImage(bird, xPos, yPos);
        ctx.restore();
    } else {
        ctx.drawImage(bird, xPos, yPos);
    }
    if(!isDied){
        ctx.fillText("Score: " + score, 10, canvas.height - 20);
    }

    yPos += grav;

    requestAnimationFrame(draw);

}
pipeBottom.onload = draw;