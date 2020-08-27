
const addButton = document.querySelector('button.addButton');
const clearButton = document.querySelector('button.clearButton');
const canvas = document.querySelector('canvas#canvas');
const screen = canvas.getContext('2d');
const radius = 3;
let dotsPos = [];
let lastClicked = [];
let drawLine = false;

window.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    if (e.target === canvas && e.buttons === 1){
        let clickedOnDot = {
            condition : false,
            x : 0,
            y : 0
        };
        for(let each = 0; each < dotsPos.length; each++) {
            const dotX = dotsPos[each][0];
            const dotY = dotsPos[each][1];
            const colisionRadius = radius + 2;
            if (x > dotX-colisionRadius && x < dotX+colisionRadius && y > dotY-colisionRadius && y < dotY+colisionRadius) {
                clickedOnDot.condition = true;
                clickedOnDot.x = dotX;
                clickedOnDot.y = dotY;
            }
        }

        if (clickedOnDot.condition && lastClicked[0] != clickedOnDot.x && lastClicked[1] != clickedOnDot.y) {
            addLine(
                lastClicked,
                [
                    clickedOnDot.x,
                    clickedOnDot.y
                ]
            );
            lastClicked = [clickedOnDot.x, clickedOnDot.y];
        } else {
            addDot(x, y);
        }
    }
});

function addRandomDot(){
    const padding = 5;
    addDot(
        Math.random() * (canvas.width-padding - padding) + padding,
        Math.random() * (canvas.height-padding - padding) + padding
    );
}

function addDot(xPos, yPos){
    dotsPos.push([xPos, yPos]);
    screen.fillStyle = 'black';
    screen.beginPath();
    screen.arc(xPos, yPos, radius, 0, 2*Math.PI);
    screen.fill();
    screen.stroke();
    if (dotsPos.length >= 2 && drawLine) {
        addLine(lastClicked, dotsPos[dotsPos.length-1]);
    }
    lastClicked = [xPos, yPos];
}

function changeDotLineMode(x) {
    drawLine = !drawLine;
    if (drawLine) {
        x.innerHTML = 'Dot';
    } else {
        x.innerHTML = 'Line';
    }
}

function addLine(from, to) {
    screen.moveTo(from[0], from[1]);
    screen.lineTo(to[0], to[1]);
    screen.stroke();
}

function clearScreen(){
    screen.clearRect(0, 0, canvas.width, canvas.height);
    dotsPos = [];
}

function lightTheme() {
    changeTheme('#899496', '#adabae', '#111');
}

function darkTheme() {
    changeTheme('#11171a', '#33393c');
}

function greenTheme() {
    changeTheme('#34483e', '#45594f');
}

function changeTheme(primary, secondary, txtColor='#adb5b8') {
    document.body.style.backgroundColor = primary;
    const buttons = document.querySelectorAll('div.bar button');
    for (var button in buttons) {
        buttons[button].style.backgroundColor = secondary;
        buttons[button].style.color = txtColor;
    }
}
