const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

let activeSquare = null;
let drag = null;

/* Třída Square - vzor/prototyp pro objekty čtverců */
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

    move() {
        if (this.keys['ArrowUp']) {
            if (this.velY > -this.speed) {
                this.velY--;
            }
        }
        
        if (this.keys['ArrowDown']) {
            if (this.velY < this.speed) {
                this.velY++;
            }
        }

        if (this.keys['ArrowRight']) {
            if (this.velX < this.speed) {
                this.velX++;
            }
        }
        if (this.keys['ArrowLeft']) {
            if (this.velX > -this.speed) {
                this.velX--;
            }
        }
    
        this.velY *= this.friction;
        this.y += this.velY;
        this.velX *= this.friction;
        this.x += this.velX; 

        if (this.x > canvas.width - this.size) {
            this.x = canvas.width - this.size;
            this.velX = -this.velX;
        } 
        
        if (this.x < 0) {
            this.x = 0;
            this.velX = -this.velX;
        }

        if (this.y > canvas.height - this.size) {
            this.y = canvas.height - this.size;
            this.velY = -this.velY;
        } 
        
        if (this.y < 0) {
            this.y = 0;
            this.velY = -this.velY;
        }
    }

    draw() {        
        ctx.translate(this.x  + this.size / 2, this.y  + this.size / 2);
        ctx.rotate((this.angle / 360) * Math.PI * 2);
        ctx.translate(-(this.x  + this.size / 2), -(this.y + this.size / 2));            
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

/* Třída Game - vzor/prototyp pro objekt hry */
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
        this.squares.forEach(function(obj, index) {
            if (obj.active) obj.move();
            obj.draw();
        });
    }

    play() {
        requestAnimationFrame(animate); 
    }
}

/* Událost stisknutí tlačítka myši nad plátnem */
canvas.addEventListener('mousedown', function(event) {  
    activeSquare = null;  
    game.squares.forEach(function(obj) {        
        if (obj.detectCursor(event.offsetX, event.offsetY)) {
            obj.active = true;
            activeSquare = obj;
        } else {
            obj.active = false;
        }
    });
    if (activeSquare) {
        drag = {curX: event.offsetX, curY: event.offsetY, x: activeSquare.x, y: activeSquare.y};
    }
});

/* Událost pohybu kurzoru myši nad plátnem */
canvas.addEventListener('mousemove', function(event) {  
    if (drag) {
        activeSquare.x = drag.x - (drag.curX - event.offsetX); 
        activeSquare.y = drag.y - (drag.curY - event.offsetY); 
    }
});

/* Událost uvolnění tlačítka myši nad plátnem */
canvas.addEventListener('mouseup', function(event) {  
    if (drag) {
        activeSquare.velX = -((drag.curX - event.offsetX) / activeSquare.size); 
        activeSquare.velY = -((drag.curY - event.offsetY) / activeSquare.size); 
    }
    drag = null;
});

/* Událost stisknutí klávesy nad stránkou */
document.addEventListener('keydown', function(event) { 
    if (activeSquare) 
        activeSquare.keys[event.code] = true;
    
    if (event.code === 'Insert') {
       let x = Math.floor(Math.random() * (canvas.width - Square.DEFAULT_SIZE)); 
       let y = Math.floor(Math.random() * (canvas.height - Square.DEFAULT_SIZE)); 
       game.addSquare(x, y);         
    }  

    if (activeSquare) {
            if (event.key == 'Delete') {
                game.squares.splice(game.squares.findIndex(obj => obj.active), 1);
            }
            if (event.code == 'KeyR') {
                activeSquare.angle = (activeSquare.angle + 30) % 360; 
            }         
            if (event.code == 'Space') {
                game.addCircle(activeSquare.x, activeSquare.y, activeSquare.angle);
            }         
    }

    if (event.altKey && event.code == 'KeyD') {
        if (confirm('Chcete opravdu smazat všechny čtverce?')) {
            activeSquare = null;
            game.squares = [];
            event.preventDefault();
        }            
    } 
});

/* Událost uvolnění klávesy nad stránkou */
document.body.addEventListener("keyup", function (event) {
    if (activeSquare) 
        activeSquare.keys[event.code] = false;
});

/* Animační funkce */
function animate() {
    requestAnimationFrame(animate);
    game.draw();    
}

/* Vytvoření nového objektu hry */
let game = new Game();
/* Spuštění hry */
game.play();