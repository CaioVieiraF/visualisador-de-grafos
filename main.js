const canvas = document.querySelector('canvas#canvas');
const screen = canvas.getContext('2d');
const radius = 10;
let dotsPos = [];
let lastClicked = [];
let drawLine = false;

function main() {

    window.addEventListener('mousedown', (e) => {
        const rect = canvas.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        if (e.target === canvas && e.buttons === 1) {
            let clickedOnDot = {
                condition: false,
                x: 0,
                y: 0
            };
            for (let each = 0; each < dotsPos.length; each++) {
                const dotX = dotsPos[each][0];
                const dotY = dotsPos[each][1];
                const colisionRadius = radius + 2;
                
                if (x > dotX - colisionRadius && x < dotX + colisionRadius && y > dotY - colisionRadius && y < dotY + colisionRadius) {
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
                const label = window.prompt("Nova vértice", "Ponto " + dotsPos.length);
                addDot(x, y, label);
            }
        }
    });

    function addRandomDot() {
        const label = window.prompt("Nova vértice", "Ponto " + dotsPos.length);
        const padding = 5;
        addDot(
            Math.random() * (canvas.width - padding - padding) + padding,
            Math.random() * (canvas.height - padding - padding) + padding,
            label
        );
    }


    function clearScreen() {
        screen.clearRect(0, 0, canvas.width, canvas.height);
        dotsPos = [];
    }

    function changeDotLineMode(x) {
        drawLine = !drawLine;
    }

    function undoMovement() {
        window.alert('Not implemented, yet');
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
    if (render) dotsPos.push([xPos, yPos, label]);
    screen.fillStyle = 'black';
    screen.beginPath();
    screen.arc(xPos, yPos, radius, 0, 2 * Math.PI);
    screen.fill();
    screen.stroke();
    screen.font = "10px Arial";
    screen.textAlign = "center";
    screen.fillText(label, xPos, yPos + radius + 12);
    if (dotsPos.length >= 2 && drawLine) {
        addLine(lastClicked, dotsPos[dotsPos.length - 1]);
    }
    lastClicked = [xPos, yPos];
}

function reRender(){
    screen.clearRect(0, 0, canvas.width, canvas.height);
    for (let dot = 0; dot < dotsPos.length; dot++){
        addDot(dotsPos[dot][0], dotsPos[dot][1], dotsPos[dot][2], false);
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
