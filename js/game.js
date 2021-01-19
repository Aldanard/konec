const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

let activeSquare = null;
let drag = null;
let score2 = document.getElementById("petr");
let score = 0;



class Square {
    static DEFAULT_SIZE = 50;
    static FILL_COLOR = 'black';
    static STROKE_COLOR = 'red';
    static FRICTION = 0.9;

    constructor(x, y, speed = 5) {
        this.x = x;
        this.y = y;
        this.velX = 0;
        this.velY = 0;
        this.angle = 0;
        this.size = Square.DEFAULT_SIZE;
        this.speed = speed;
        this.color = Square.FILL_COLOR;
        this.active = false;
        this.friction = Square.FRICTION;
        this.keys = [];
    }

    detectCursor(curX, curY) {
        return (curX >= this.x && curX <= this.x + this.size) && (curY >= this.y && curY <= this.y + this.size);
    }

    draw() {
        ctx.translate(this.x + this.size / 2, this.y + this.size / 2);
        ctx.rotate((this.angle / 360) * Math.PI * 2);
        ctx.translate(-(this.x + this.size / 2), -(this.y + this.size / 2));
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.size, this.size);
        if (this.active) {
            ctx.beginPath();
            ctx.strokeStyle = Square.STROKE_COLOR;
            ctx.lineWidth = 5;
            ctx.strokeRect(this.x, this.y, this.size, this.size);
            ctx.closePath();

        }
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }




}




class Game {
    constructor() {
        this.squares = [];
    }

    addSquare(x, y) {
        this.squares.push(new Square(x, y));
        console.log(this.squares);
    }

    draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.squares.forEach(function (obj, index) {
            if (obj.active); {

            };
            obj.draw();
        });
    }

    play() {
        requestAnimationFrame(animate);
    }
}


canvas.addEventListener('mousedown', function (event) {
    activeSquare = null;
    game.squares.forEach(function (obj, index, array) {
        if (obj.detectCursor(event.offsetX, event.offsetY)) {
            obj.active = true;
            /* activeSquare = obj;  */
            array.splice(index, 1);
            console.log(array.length);
            score++;
            score2.innerHTML = score;
        } else {
            obj.active = false;
        }
    });
    if (activeSquare) {
        score++;
        console.log(score);
    }
});



document.addEventListener('keydown', function (event) {
    if (activeSquare)
        activeSquare.keys[event.code] = true;




    if (event.code === 'Insert') {



    }

    if (event.altKey && event.code == 'KeyD') {
        if (confirm('Chcete opravdu smazat všechny čtverce?')) {

        }
    }
});


document.body.addEventListener("keyup", function (event) {
    if (activeSquare)
        activeSquare.keys[event.code] = false;
});


function animate() {
    requestAnimationFrame(animate);
    game.draw();
}


let game = new Game();
let time = 500;
game.play();
function start() {
    let cass = setInterval(function () {
        let x = Math.floor(Math.random() * (canvas.width - Square.DEFAULT_SIZE));
        let y = Math.floor(Math.random() * (canvas.height - Square.DEFAULT_SIZE));
        game.addSquare(x, y);

    }, time);
    setInterval (function(){
        if (time>300){
        clearInterval (cass);
        time-=25;
        start();}
        },5000);
}




