var five = require('johnny-five');
var board = new five.Board();
var motorRight;
var motorLeft;
var compass;

var PID = require('pid-controller');
var heading = 0;
var headingSetpoint = 0;
var Kp = 5;
var Ki = 0;
var Kd = 0;
var ctrl = new PID(heading, headingSetpoint, Kp, Ki, Kd, 'reverse');
board.on('ready', function(){
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
    Forward : function(pwm) {
      motorRight.forward(pwm);
      motorLeft.forward(pwm);
    },
    Backward : function(pwm) {
      motorRight.reverse(pwm);
      motorLeft.reverse(pwm);
    },
    RotateLeft : function(pwm) {
      motorRight.forward(pwm);
      motorLeft.reverse(pwm);
    },
    RotateRight : function(pwm) {
      motorRight.reverse(pwm);
      motorLeft.forward(pwm);
    },
    TurnLeft : function(pwm) {
      motorRight.forward(pwm);
      motorLeft.brake();
    },
    TurnRight : function(pwm) {
      motorRight.brake();
      motorLeft.forward(pwm);
    },
    Stop : function() {
      motorRight.brake();
      motorLeft.brake();
    }
  }

  var pidUtils = {
    init : function() {
      ctrl.setPoint(0);
      ctrl.setMode(PID.AUTOMATIC);
      ctrl.setSampleTime(1);
    },
    readCompass : function() {
      return heading;
    },
    pidLoop : function() {
      ctrl.setInput(10 - heading);
      ctrl.compute();
      pidUtils.setMotor(ctrl);
    },
    setMotor : function(pid) {
      console.log('PID', Math.floor(pid.getOutput()) , Math.floor(pid.getSetPoint()), Math.floor(pid.getInput()), pid.getDirection(), Math.floor(heading));
      //Q1 && Q2
      if(pid.getSetPoint() >= 0 &&
              pid.getSetPoint() < 180){
                console.log('Q1');
        if((180+pid.getSetPoint()) > heading){
          console.log('right', pid.getOutput());
          motorUtils.RotateRight(pid.getOutput());
        }
        else if ((180+pid.getSetPoint()) < heading ||
                  pid.getSetPoint() > heading) {
          console.log('left', pid.getOutput());
          motorUtils.RotateLeft(pid.getOutput());
        }
      }
      //Q3
      else if (pid.getSetPoint() > 180 &&
               pid.getSetPoint() < 270){
                 console.log('Q3');
         if((180+pid.getSetPoint()) > heading){
           motorUtils.RotateRight(pid.getOutput());
         }
         else if (pid.getSetPoint() > heading) {
           motorUtils.RotateLeft(pid.getOutput());
         }
      }
      //Q4
      else if (pid.getSetPoint() > 270 &&
               pid.getSetPoint() <= 360){
                 console.log('Q4');
         if((180+pid.getSetPoint()) > heading ||
             (pid.getSetPoint() - 180) > heading){
           motorUtils.RotateRight(pid.getOutput());
         }
         else if ((pid.getSetPoint() - 180) < heading) {
           motorUtils.RotateLeft(pid.getOutput());
         }
      }
    }
  }

  compass= new five.Compass({
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
  compass.once('data', function(){
    pidUtils.init();
    setInterval(pidUtils.pidLoop, 5);
  });

});
