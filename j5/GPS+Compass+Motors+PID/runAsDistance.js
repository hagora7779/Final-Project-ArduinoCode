var five = require('johnny-five');
var board = new five.Board();
var motorRight;
var motorLeft;
var compass;

var setDegree = 50;
var Lat = 0;
var Lon = 0;
var startLat = 0;
var startLon = 0;
var speedLeft = 255;
var speedRight = 255;
var PID = require('pid-controller');
var heading = 0;
var headingSetpoint = 0;
var Kp = 15;
var Ki = 0;
var Kd = 0;
var pidTick;
var ctrl = new PID(heading, headingSetpoint, Kp, Ki, Kd);
board.on('ready', function() {
    console.log('robot ready');
    var gps = new five.GPS({
        port: this.io.SERIAL_PORT_IDs.HW_SERIAL3,
        baud: 4800
    });

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
            ctrl.setSampleTime(1);
            ctrl.setOutputLimits(0, 255);
        },
        readCompass: function() {
            return heading;
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
            //console.log('forward,'+new Date().getTime()+','+ctrl.getOutput()+','+(setDegree - pid_heading)+','+0+','+setDegree+','+heading);
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
                    //motorUtils.RotateRight(pid.getOutput());
                    var speedTune = speedRight - pid.getOutput();
                    motorLeft.forward(speedLeft);
                    motorRight.forward(speedTune);
                } else {
                    pid_rotateDirection = 'left';
                    // motorUtils.RotateLeft(pid.getOutput());
                    var speedTune = speedLeft - pid.getOutput();
                    motorLeft.forward(speedTune);
                    motorRight.forward(speedRight);
                }
                pid_quarter = 'Q1';
            }
            //Q2
            else if (setDegree >= 90 && setDegree < 180) {
                if ((setDegree + 180) > heading && setDegree < heading) {
                    pid_rotateDirection = 'right';
                    // motorUtils.RotateRight(pid.getOutput());
                    var speedTune = speedRight - pid.getOutput();
                    motorLeft.forward(speedLeft);
                    motorRight.forward(speedTune);
                } else {
                    pid_rotateDirection = 'left';
                    // motorUtils.RotateLeft(pid.getOutput());
                    var speedTune = speedLeft - pid.getOutput();
                    motorLeft.forward(speedTune);
                    motorRight.forward(speedRight);
                }
                pid_quarter = 'Q2';
            }
            //Q3
            else if (setDegree >= 180 && setDegree < 270) {
                if (heading > setDegree || heading < (setDegree - 180)) {
                    pid_rotateDirection = 'right';
                    // motorUtils.RotateRight(pid.getOutput());
                    var speedTune = speedRight - pid.getOutput();
                    motorLeft.forward(speedLeft);
                    motorRight.forward(speedTune);
                } else {
                    pid_rotateDirection = 'left';
                    // motorUtils.RotateLeft(pid.getOutput());
                    var speedTune = speedLeft - pid.getOutput();
                    motorLeft.forward(speedTune);
                    motorRight.forward(speedRight);
                }
                pid_quarter = 'Q3';
            }
            //Q4
            else if (setDegree >= 270 && setDegree <= 360) {
                if ((setDegree - 180) > heading || setDegree < heading) {
                    pid_rotateDirection = 'right';
                    // motorUtils.RotateRight(pid.getOutput());
                    var speedTune = speedRight - pid.getOutput();
                    motorLeft.forward(speedLeft);
                    motorRight.forward(speedTune);
                } else {
                    pid_rotateDirection = 'left';
                    // motorUtils.RotateLeft(pid.getOutput());
                    var speedTune = speedLeft - pid.getOutput();
                    motorLeft.forward(speedTune);
                    motorRight.forward(speedRight);
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
        setDegree = this.heading;
    });

    // If latitude, longitude, course or speed change log it
    gps.on("change", function() {
        Lat = this.latitude;
        Lon = this.longitude;
    });
    gps.on("sentence", function(data) {
      console.log(data);
    });
    gps.once("change", function() {
        startLat = this.latitude;
        startLon = this.longitude;
        console.log('gps ready');
        //console.log("action,timestamp,output,input,setpoint,setdegree,heading,Lat,Lon");
        pidUtils.init();
        pidTick = setInterval(pidUtils.pidLoop, 5);
        setInterval(function() {
            if (gpsDistance(startLat, startLon, Lat, Lon, "M") > 15) {
                clearInterval(pidTick);
                motorUtils.Stop();
            }
        }, 5);
    });
});

board.on('error', function(msg) {
    console.log('error : ', msg);
});
board.on('disconnect', function(msg) {
    console.log('disconnect : ', msg);
});
board.on('close', function(msg) {
    console.log('close : ', msg);
});

function gpsDistance(lat1, lon1, lat2, lon2, unit) {
    var radlat1 = Math.PI * lat1 / 180
    var radlat2 = Math.PI * lat2 / 180
    var theta = lon1 - lon2
    var radtheta = Math.PI * theta / 180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist)
    dist = dist * 180 / Math.PI
    dist = dist * 60 * 1.1515
    if (unit == "K") {
        dist = dist * 1.609344
    }
    if (unit == "M") {
        dist = dist * 1.609344 * 1000
    }
    if (unit == "N") {
        dist = dist * 0.8684
    }
    return dist
}
