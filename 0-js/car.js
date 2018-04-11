const GROUNDSPEED_DECAY_MULT = 0.94;
const DRIVE_POWER   = 0.5;
const REVERSE_POWER = 0.2;
const TURN_RATE     = 0.1;
const MIN_SPEED_TO_TURN = 0.5;

function carClass() {
    this.x     = 75;
    this.y     = 75;
    this.ang   = 0;
    this.speed = 0;
    this.myCarPic; // which picture to use

    // car input control
    this.keyHeld_Gas        = false;
    this.keyHeld_Reverse    = false;
    this.keyHeld_TurnLeft   = false;
    this.keyHeld_TurnRight  = false;

    this.controlKeyUp;
    this.controlKeyRight;
    this.controlKeyDown;
    this.controlKeyLeft;

    this.setupInput = function(upKey, rightKey, downKey, leftKey) {
        this.controlKeyUp    = upKey;
        this.controlKeyRight = rightKey;
        this.controlKeyDown  = downKey;
        this.controlKeyLeft  = leftKey;
    }

    this.reset = function(whichImage) {
        this.myCarPic = whichImage;

        for (var eachRow=0; eachRow<TRACK_ROWS; eachRow++) {
            for (var eachCol=0; eachCol<TRACK_COLS; eachCol++) {
                var arrayIndex = rowColToArrayIndex(eachCol, eachRow);
                if (trackGrid[arrayIndex] == TRACK_PLAYERSTART) {
                    trackGrid[arrayIndex] = TRACK_ROAD;
                    // this.ang = -Math.PI/2; using radians not degrees
                    this.x = eachCol * TRACK_W + TRACK_W / 2;
                    this.y = eachRow * TRACK_H;
                    return;
                }   // player start if end
            }       // col for end
        }           // row for end
    }               // carReset func end

    this.move = function() {
        this.speed *= GROUNDSPEED_DECAY_MULT;

        if(this.keyHeld_Gas) {
            this.speed += DRIVE_POWER;
        }
        if(this.keyHeld_Reverse) {
            this.speed -= REVERSE_POWER;
        }
        if(Math.abs(this.speed) > MIN_SPEED_TO_TURN) {
            if(this.keyHeld_TurnRight) {
                this.ang += TURN_RATE;
            }
            if(this.keyHeld_TurnLeft) {
                this.ang -= TURN_RATE;
            }
        }

        this.x += Math.cos(this.ang) * this.speed;
        this.y += Math.sin(this.ang) * this.speed;

        carTrackHandling(this);

        // console.log(this.speed);
    }               // carMove func end

    this.draw = function() {
        drawBitmapCanteredWithRotation(this.myCarPic, this.x, this.y, this.ang);
    }
}                   // carClass end
