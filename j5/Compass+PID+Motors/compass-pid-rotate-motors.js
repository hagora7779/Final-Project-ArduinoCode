var five = require('johnny-five');
var board = new five.Board();
var motorRight;
var motorLeft;
var compass;

var setDegree = 0;
var PID = require('pid-controller');
var heading = 0;
var Kp = 10;
var Ki = 0;
var Kd = 0;
var ctrl = new PID(heading, heading, Kp, Ki, Kd);
board.on('ready', function() {
    motorLeft = new five.Motor({
        pins: {
            pwm: 4,
            dir: 50,
            cdir: 51
        }
    });
    motorRight = new five.Motor({
        pins: {
            pwm: 5,
            dir: 52,
            cdir: 53
        }
    });
    motorUtils = {
        Forward: function(pwm) {
            motorRight.forward(pwm);
            motorLeft.forward(pwm);
        },
        Backward: function(pwm) {
            motorRight.reverse(pwm);
            motorLeft.reverse(pwm);
        },
        RotateLeft: function(pwm) {
            motorRight.forward(pwm);
            motorLeft.reverse(pwm);
        },
        RotateRight: function(pwm) {
            motorRight.reverse(pwm);
            motorLeft.forward(pwm);
        },
        TurnLeft: function(pwm) {
            motorRight.forward(pwm);
            motorLeft.brake();
        },
        TurnRight: function(pwm) {
            motorRight.brake();
            motorLeft.forward(pwm);
        },
        Stop: function() {
            motorRight.brake();
            motorLeft.brake();
        }
    }

    var pidUtils = {
        init: function() {
            ctrl.setPoint(0);
            ctrl.setMode(PID.AUTOMATIC);
            ctrl.setSampleTime(5);
            ctrl.setOutputLimits(0, 255);
        },
        pidLoop: function() {
            var pid_heading = heading;
            var setInput;
            //Q1
            if (setDegree >= 0 && setDegree < 90) {
                if ((setDegree + 180) > pid_heading && setDegree < pid_heading) {

                } else {
                    if (pid_heading > (180 + setDegree)) {
                        pid_heading = (180 + setDegree) - (pid_heading - (180 + setDegree));
                    }
                }
            }
            //Q2
            else if (setDegree >= 90 && setDegree < 180) {
                if ((setDegree + 180) > pid_heading && setDegree < pid_heading) {

                } else {
                    if (pid_heading > (180 + setDegree)) {
                        pid_heading = (180 + setDegree) - (pid_heading - (180 + setDegree));
                    }
                }
            }
            //Q3
            else if (setDegree >= 180 && setDegree < 270) {
                if (pid_heading > setDegree || pid_heading < (setDegree - 180)) {
                    if (pid_heading < (setDegree - 180)) {
                        pid_heading = (setDegree - 180) + ((setDegree - 180) - pid_heading);
                    }
                } else {

                }
            }
            //Q4
            else if (setDegree >= 270 && setDegree <= 360) {
                if ((setDegree - 180) > pid_heading || setDegree < pid_heading) {
                    if (pid_heading < (setDegree - 180)) {
                        pid_heading = (setDegree - 180) + ((setDegree - 180) - pid_heading);
                    }
                } else {

                }
            }
            setInput = Math.abs(setDegree - pid_heading);
            ctrl.setInput(setInput);
            ctrl.compute();
            console.log('rotate,'+new Date().getTime()+','+ctrl.getOutput()+','+(setDegree - pid_heading)+','+0+','+setDegree+','+heading);
            pidUtils.setMotor(ctrl);
        },
        setMotor: function(pid) {
            var pid_output = Math.floor(pid.getOutput());
            var pid_setpoint = Math.floor(pid.getSetPoint());
            var pid_input = Math.floor(pid.getInput());
            var pid_direction = pid.getDirection();
            var pid_heading = Math.floor(heading);
            var pid_rotateDirection = '';
            var pid_quarter = ''
                //Q1
            if (setDegree >= 0 && setDegree < 90) {
                if ((setDegree + 180) > heading && setDegree < heading) {
                    pid_rotateDirection = 'right';
                    motorUtils.RotateRight(pid.getOutput());
                } else {
                    pid_rotateDirection = 'left';
                    motorUtils.RotateLeft(pid.getOutput());
                }
                pid_quarter = 'Q1';
            }
            //Q2
            else if (setDegree >= 90 && setDegree < 180) {
                if ((setDegree + 180) > heading && setDegree < heading) {
                    pid_rotateDirection = 'right';
                    motorUtils.RotateRight(pid.getOutput());
                } else {
                    pid_rotateDirection = 'left';
                    motorUtils.RotateLeft(pid.getOutput());
                }
                pid_quarter = 'Q2';
            }
            //Q3
            else if (setDegree >= 180 && setDegree < 270) {
                if (heading > setDegree || heading < (setDegree - 180)) {
                    pid_rotateDirection = 'right';
                    motorUtils.RotateRight(pid.getOutput());
                } else {
                    pid_rotateDirection = 'left';
                    motorUtils.RotateLeft(pid.getOutput());
                }
                pid_quarter = 'Q3';
            }
            //Q4
            else if (setDegree >= 270 && setDegree <= 360) {
                if ((setDegree - 180) > heading || setDegree < heading) {
                    pid_rotateDirection = 'right';
                    motorUtils.RotateRight(pid.getOutput());
                } else {
                    pid_rotateDirection = 'left';
                    motorUtils.RotateLeft(pid.getOutput());
                }
                pid_quarter = 'Q4';
            }
        }
    }

    compass = new five.Compass({
        controller: "HMC5883L"
    });

    board.repl.inject({
        motorUtils: motorUtils,
        motorLeft: motorLeft,
        motorRight: motorRight,
        ctrl: ctrl
    });


    compass.on('data', function() {
        heading = this.heading;
    });
    compass.once('data', function() {
        console.log("action,timestamp,output,input,setpoint,setdegree,heading");
        setDegree = setDegreeLimit(this.heading + 100);
        pidUtils.init();
        setInterval(pidUtils.pidLoop, 5);
        setInterval(function(){
          if (Math.abs(setDegree - heading) < 1) {
              motorUtils.Stop();
          }
        },5);
    });

});

board.on('error', function(msg) {
    console.log('error : ', msg);
});
board.on('disconnect', function(msg) {
    console.log('disconnect : ', msg);
});
board.on('close', function(msg) {
    console.log('disconnect : ', msg);
});

function setDegreeLimit(degree) {
    if (degree > 360) {
        degree = degree - 360;
    }
    return degree;
}
