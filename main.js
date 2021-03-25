const canvas = document.querySelector('canvas#canvas');
const screen = canvas.getContext('2d');
const radius = 10;
let dotsPos = [];
let lastClicked = [];
let drawLine = false;
let lastMove = { first: true, dot: false, line: false, previus: {}};

function main() {

    window.addEventListener('mousedown', (e) => {
        const rect = canvas.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        if (e.target === canvas && e.buttons === 1 || e.target === canvas && e.buttons === 2) {
            let clickedOnDot = {
                condition: false,
                x: 0,
                y: 0,
                from: null
            };
            for (let each = 0; each < dotsPos.length; each++) {
                const dotX = dotsPos[each][0];
                const dotY = dotsPos[each][1];
                const colisionRadius = radius + 2;
                
                if (x > dotX - colisionRadius && x < dotX + colisionRadius && y > dotY - colisionRadius && y < dotY + colisionRadius) {
                    clickedOnDot.condition = true;
                    clickedOnDot.x = dotX;
                    clickedOnDot.y = dotY;
                    clickedOnDot.to = each;
                }
            }

            if (clickedOnDot.condition && lastClicked[0] != clickedOnDot.x && lastClicked[1] != clickedOnDot.y && e.buttons === 2) {
                dotsPos[clickedOnDot.to][3].push(lastClicked[2]);
                dotsPos[lastClicked[2]][3].push(clickedOnDot.to);
                addLine(
                    [lastClicked[0], lastClicked[1]],
                    [
                        clickedOnDot.x,
                        clickedOnDot.y
                    ]
                );
                lastClicked = [clickedOnDot.x, clickedOnDot.y, clickedOnDot.to];

                lastMove.previus = lastMove;
                if (lastMove.first) lastMove.first = false;
                lastMove.dot = false;
                lastMove.line = true;
            } else {
                lastClicked = [];
                const label = window.prompt("Nova vértice", "Ponto " + dotsPos.length);
                if (label){
                    addDot(x, y, label);
                    lastMove.previus = lastMove;
                    if (lastMove.first) lastMove.first = false;
                    lastMove.dot = true;
                    lastMove.line = false;
                }
            }
        }
    });

    function addRandomDot() {
        const label = window.prompt("Nova vértice", "Ponto " + dotsPos.length);
        if (label){
            const padding = 5;
            addDot(
                Math.random() * (canvas.width - padding - padding) + padding,
                Math.random() * (canvas.height - padding - padding) + padding,
                label
            );
        }
    }


    function clearScreen() {
        screen.clearRect(0, 0, canvas.width, canvas.height);
        dotsPos = [];
        lastMove = { first: true, dot: false, line: false, previus: {} };
        lastClicked = [];

    }

    function changeDotLineMode(x) {
        drawLine = !drawLine;
    }

    function undoMovement() {
        if (lastMove.dot) {
            dotsPos.pop();
        } else {
            dotsPos[dotsPos[lastClicked[2]][3]][3].pop();
            dotsPos[lastClicked[2]][3].pop();
        }
        reRender();
        lastMove = previus;
    }

    themeOptions();

    const buttonOptions = {
        Add: addRandomDot,
        'Line/Dot': changeDotLineMode,
        Undo: undoMovement,
        Clear: clearScreen,
    };

    const optionsBar = document.querySelector('div.bar');
    for (let buttonOption in buttonOptions) {
        const newButton = document.createElement("button");
        newButton.onclick = () => {
            buttonOptions[buttonOption]();
        };
        newButton.innerHTML = buttonOption;
        optionsBar.appendChild(newButton);
    }

    //canvas.oncontextmenu = (e) => {
    //    e.preventDefault();
    //}
    canvas.addEventListener("contextmenu", function(e){
      e.preventDefault();
    }, false);
}

function themeOptions() {
    const themes = {
        lightTheme: {
            primary: '#899496',
            secondary: '#adabae',
            text: '#111',
        },
        darkTheme: {
            primary: '#11171a',
            secondary: '#33393c',
        },
        greenTheme: {
            primary: '#34483e',
            secondary: '#45594f',
        }
    }
    const container = document.querySelector('div.theme');
    for (let theme in themes) {
        const button = document.createElement("button");
        button.onclick = () => {
            changeTheme(
                themes[theme].primary,
                themes[theme].secondary,
                themes[theme].text
            );
        };
        button.style.backgroundColor = themes[theme].primary;
        container.appendChild(button);
    }
}

function addLine(from, to) {
    screen.moveTo(from[0], from[1]);
    screen.lineTo(to[0], to[1]);
    screen.stroke();
}

function addDot(xPos, yPos, label, render=true) {
    if (render) dotsPos.push([xPos, yPos, label, []]);
    screen.fillStyle = 'black';
    screen.beginPath();
    screen.arc(xPos, yPos, radius, 0, 2 * Math.PI);
    screen.fill();
    screen.stroke();
    screen.font = "10px Arial";
    screen.textAlign = "center";
    screen.fillText(label, xPos, yPos + radius + 12);
    if (dotsPos.length >= 2 && drawLine) {
        addLine([lastClicked[0], lastClicked[1]], dotsPos[dotsPos.length - 1]);
    }
    lastClicked = [xPos, yPos, dotsPos.length-1];
}

function reRender(){
    screen.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < dotsPos.length; i++){
        const dot = dotsPos[i];
        addDot(dot[0], dot[1], dot[2], false);
        for (let n in dot[3]){
            const connected_dot = dotsPos[n];
            addLine([dot[0], dot[1]], [connected_dot[0], connected_dot[1]]);
        }
    }
}

function changeTheme(primary, secondary, txtColor = '#adb5b8') {
    document.body.style.backgroundColor = primary;
    const buttons = document.querySelector('div.bar').children;
    for (let button in buttons) {
        if (button == Number(button)) {
            buttons[button].style.backgroundColor = secondary;
            buttons[button].style.color = txtColor;
        }
    }
}

main();
