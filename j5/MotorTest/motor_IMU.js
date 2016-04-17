var five = require("johnny-five");
var board = new five.Board();

board.on("ready", function() {
  var speed = 0;
  var imu = new five.IMU({
    controller: "MPU6050"
  });
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
  imu.on("change", function() {
      console.log("temperature");
      console.log("  celsius      : ", this.temperature.celsius);
      console.log("  fahrenheit   : ", this.temperature.fahrenheit);
      console.log("  kelvin       : ", this.temperature.kelvin);
      console.log("--------------------------------------");

      console.log("accelerometer");
      console.log("  x            : ", this.accelerometer.x);
      console.log("  y            : ", this.accelerometer.y);
      console.log("  z            : ", this.accelerometer.z);
      console.log("  pitch        : ", this.accelerometer.pitch);
      console.log("  roll         : ", this.accelerometer.roll);
      console.log("  acceleration : ", this.accelerometer.acceleration);
      console.log("  inclination  : ", this.accelerometer.inclination);
      console.log("  orientation  : ", this.accelerometer.orientation);
      console.log("--------------------------------------");

      console.log("gyro");
      console.log("  x            : ", this.gyro.x);
      console.log("  y            : ", this.gyro.y);
      console.log("  z            : ", this.gyro.z);
      console.log("  pitch        : ", this.gyro.pitch);
      console.log("  roll         : ", this.gyro.roll);
      console.log("  yaw          : ", this.gyro.yaw);
      console.log("  rate         : ", this.gyro.rate);
      console.log("  isCalibrated : ", this.gyro.isCalibrated);
      console.log("--------------------------------------");
  });
});
