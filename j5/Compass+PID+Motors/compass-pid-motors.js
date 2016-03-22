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
      ctrl.setInput(10 - pidUtils.readCompass());
      ctrl.compute();
      pidUtils.setMotor(ctrl.getOutput());
    },
    setMotor : function(output) {
      //console.log('PID', Math.floor(ctrl.getOutput()) , Math.floor(ctrl.getSetPoint()), ctrl.getInput(), ctrl.getDirection(), heading);
      //Q1 && Q2
      if(ctrl.getSetPoint() >= 0 &&
              ctrl.getSetPoint() < 180){
                console.log('Q1');
        if((180+ctrl.getSetPoint()) > pidUtils.readCompass()){
          console.log('right', output);
          motorUtils.RotateRight(output);
        }
        else if ((180+ctrl.getSetPoint()) < pidUtils.readCompass() ||
                  ctrl.getSetPoint() > pidUtils.readCompass()) {
          console.log('left');
          motorUtils.RotateLeft(ctrl.getOutput());
        }
      }
      //Q3
      else if (ctrl.getSetPoint() > 180 &&
               ctrl.getSetPoint() < 270){
                 console.log('Q3');
         if((180+ctrl.getSetPoint()) > pidUtils.readCompass()){
           motorUtils.RotateRight(ctrl.getOutput());
         }
         else if (ctrl.getSetPoint() > pidUtils.readCompass()) {
           motorUtils.RotateLeft(ctrl.getOutput());
         }
      }
      //Q4
      else if (ctrl.getSetPoint() > 270 &&
               ctrl.getSetPoint() <= 360){
                 console.log('Q4');
         if((180+ctrl.getSetPoint()) > pidUtils.readCompass() ||
             (ctrl.getSetPoint() - 180) > pidUtils.readCompass()){
           motorUtils.RotateRight(ctrl.getOutput());
         }
         else if ((ctrl.getSetPoint() - 180) < pidUtils.readCompass()) {
           motorUtils.RotateLeft(ctrl.getOutput());
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
    setInterval(pidUtils.pidLoop, 1);
  });

});
