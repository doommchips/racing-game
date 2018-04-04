var carPic = document.createElement("img");
var carPicLoaded = false;

var carX = 75;
var carY = 75;
var carAng = 0
var carSpeed = 0;

const TRACK_W = 40;
const TRACK_H = 40;
const TRACK_GAP = 2;
const TRACK_COLS = 20;
const TRACK_ROWS = 15;
var trackGrid = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1,
                 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1,
                 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1,
                 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 1,
                 1, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1,
                 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
                 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
                 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1,
                 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
                 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1,
                 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
                 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                 1, 2, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1,
                 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ];
var tracksRemaining = 0;

var canvas, canvasContext;

const KEY_LEFT_ARROW = 37;
const KEY_UP_ARROW = 38;
const KEY_RIGHT_ARROW = 39;
const KEY_DOWN_ARROW = 40;

var keyHeld_Gas = false;
var keyHeld_Reverse = false;
var keyHeld_TurnLeft = false;
var keyHeld_TurnRight = false;

var mouseX = 0;
var mouseY = 0;

function updateMousePos(evt) {
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;

    mouseX = evt.clientX - rect.left - root.scrollLeft;
    mouseY = evt.clientY - rect.top  - root.scrollTop;

    // cheats
    // carX = mouseX;
    // carY = mouseY;
    // carSpeedX = 4;
    // carSpeedY = -4;
}

function keyPressed(evt) {
    // console.log('Key pressed: ' + evt.keyCode);
    if(evt.keyCode == KEY_LEFT_ARROW) {
        keyHeld_TurnLeft = true;
    }
    if(evt.keyCode == KEY_RIGHT_ARROW) {
        keyHeld_TurnRight= true;
    }
    if(evt.keyCode == KEY_UP_ARROW) {
        keyHeld_Gas = true;
    }
    if(evt.keyCode == KEY_DOWN_ARROW) {
        keyHeld_Reverse = true;
    }
}

function keyReleased(evt) {
    // console.log('Key released: ' + evt.keyCode);
    if(evt.keyCode == KEY_LEFT_ARROW) {
        keyHeld_TurnLeft = false;
    }
    if(evt.keyCode == KEY_RIGHT_ARROW) {
        keyHeld_TurnRight= false;
    }
    if(evt.keyCode == KEY_UP_ARROW) {
        keyHeld_Gas = false;
    }
    if(evt.keyCode == KEY_DOWN_ARROW) {
        keyHeld_Reverse = false;
    }
}

window.onload = function() {
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');

    var framesPerSecond = 30;
    setInterval(updateAll, 1000/framesPerSecond);

    canvas.addEventListener('mousemove', updateMousePos);
    document.addEventListener('keydown', keyPressed);
    document.addEventListener('keyup', keyReleased);

    carPic.onload = function () {
        carPicLoaded = true;
    }
    carPic.src = "player1car.png";

    carReset();
}

function updateAll() {
    moveAll();
    drawAll();
}

function carReset() {
    for (var eachRow=0; eachRow<TRACK_ROWS; eachRow++) {
        for (var eachCol=0; eachCol<TRACK_COLS; eachCol++) {
            var arrayIndex = rowColToArrayIndex(eachCol, eachRow);
            if (trackGrid[arrayIndex] == 2) {
                trackGrid[arrayIndex] = 0;
                // carAng = -Math.PI/2; using radians not degrees
                carX = eachCol * TRACK_W + TRACK_W / 2;
                carY = eachRow * TRACK_H;
            }
        }
    }
}

function carMove() {
    carSpeed *= 0.97;

    if(keyHeld_Gas) {
        carSpeed += 0.3;
    }
    if(keyHeld_Reverse) {
        carSpeed -= 0.3;
    }
    if(keyHeld_TurnRight) {
        carAng += 0.05;
    }
    if(keyHeld_TurnLeft) {
        carAng -= 0.05;
    }

    carX += Math.cos(carAng) * carSpeed;
    carY += Math.sin(carAng) * carSpeed;
}

function isTrackAtColRow(col, row) {
    if (col >= 0 && col < TRACK_COLS &&
        row >= 0 && row < TRACK_ROWS) {
        var trackIndexUnderCoord = rowColToArrayIndex(col, row);
        return (trackGrid[trackIndexUnderCoord] == 1);
    } else {
        return false;
    }
}

function carTrackHandling() {
    var carTrackCol = Math.floor(carX / TRACK_W);
    var carTrackRow = Math.floor(carY / TRACK_H);
    var trackIndexUnderCar = rowColToArrayIndex(carTrackCol, carTrackRow);

    if (carTrackCol >= 0 && carTrackCol < TRACK_COLS &&
        carTrackRow >= 0 && carTrackRow < TRACK_ROWS) {
        if (isTrackAtColRow(carTrackCol, carTrackRow)) {
            carX -=Math.cos(carAng) * carSpeed;
            carY -=Math.sin(carAng) * carSpeed;
            // two lines above address collision bug where car can burrow into wall
            carSpeed *= -0.5;
        }   // end of track found
    }       // end of valid col and row check
}           // end of func

function moveAll() {
    carMove();
    carTrackHandling();
}

function rowColToArrayIndex(col, row) {
    return col + TRACK_COLS * row;
}

function drawTracks() {
    for (var eachRow=0; eachRow<TRACK_ROWS; eachRow++) {
        for (var eachCol=0; eachCol<TRACK_COLS; eachCol++) {

            var arrayIndex = rowColToArrayIndex(eachCol, eachRow);

            if (trackGrid[arrayIndex] == 1) {
                colourRect(TRACK_W*eachCol,TRACK_H*eachRow, TRACK_W-2,TRACK_H-2, 'blue');
            }   // end of is this track here
        }       // end of for each track col
    }           // end of for each track row
}               // end of draw tracks func

function drawAll() {
    colourRect(0,0, canvas.width,canvas.height, 'black');   // clear screen
    // colourCircle(carX,carY, 10, 'white');                 // draw car

    if(carPicLoaded) {
        drawBitmapCanteredWithRotation(carPic, carX, carY, carAng);
    }

    // drawing the canvas and car on every frame is needed
    // else old car would not be removed and look as though had tail

    drawTracks();
}

function drawBitmapCanteredWithRotation(useBitmap, atX, atY, withAng) {
    canvasContext.save();
    canvasContext.translate(atX, atY);
    canvasContext.rotate(withAng);
    canvasContext.drawImage(useBitmap,-useBitmap.width/2,-useBitmap.height/2);
    canvasContext.restore();
}

function colourRect(topLeftX,topLeftY, boxWidth,boxHeight, fillColour) {
    canvasContext.fillStyle = fillColour;
    canvasContext.fillRect(topLeftX,topLeftY, boxWidth,boxHeight);
}

function colourCircle(centerX,centerY, radius, fillColour) {
    canvasContext.fillStyle = fillColour;
    canvasContext.beginPath();
    canvasContext.arc(centerX,centerY, radius, 0,Math.PI*2, true)
    canvasContext.fill();
}

function colourText(showWords, textX,textY, fillColour) {
    canvasContext.fillStyle = fillColour;
    canvasContext.fillText(showWords, textX,textY);
}
