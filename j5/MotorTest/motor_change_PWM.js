var five = require("johnny-five");
var board = new five.Board();

board.on("ready", function() {
  var speed = 0;
  var motorLeft = new five.Motor({
    pins: {
      pwm: 4,
      dir: 50,
      cdir: 51
    }
  });
  var motorRight = new five.Motor({
    pins: {
      pwm: 5,
      dir: 52,
      cdir: 53
    }
  });
  var motorUtils = {
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

  board.repl.inject({
    motorLeft : motorLeft,
    motorRight : motorRight
  });
  function increaseSpeed() {
    speed += 30;
    console.log(speed);
    if(speed >= 255){
      speed = 0;
    }
    motorUtils.Forward(speed);
  }
  setInterval(increaseSpeed, 1000);
});
