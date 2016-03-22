var five = require('johnny-five');
var board = new five.Board();
var motorRight;
var motorLeft;
var keypress = require('keypress');



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

  board.repl.inject({
    motorLeft: motorLeft,
    motorRight: motorRight
  });

  motorRight.on("start", function() {
    console.log("start", Date.now());
  });

  motorRight.on("stop", function() {
    console.log("automated stop on timer", Date.now());
  });

  motorRight.on("brake", function() {
    console.log("automated brake on timer", Date.now());
  });
});

// make `process.stdin` begin emitting "keypress" events
keypress(process.stdin);

// listen for the "keypress" event
process.stdin.on('keypress', function (ch, key) {
  console.log('got "keypress"', key);
  if (key && key.ctrl && key.name === 'c') {
    // process.stdin.pause();
  }
  if(key.name === 'w'){
    motorRight.forward(255);
    motorLeft.forward(255);
  }
  else if (key.name === 's') {
    motorRight.reverse(255);
    motorLeft.reverse(255);
  }
  else if (key.name === 'a') {
    motorRight.forward(255);
    motorLeft.reverse(255);
  }
  else if (key.name === 'q') {
    motorRight.forward(255);
    motorLeft.brake();
  }
  else if (key.name === 'd') {
    motorRight.reverse(255);
    motorLeft.forward(255);
  }
  else if (key.name === 'e') {
    motorRight.brake();
    motorLeft.forward(255);
  }
  else if (key.name === 'space') {
    motorRight.brake();
    motorLeft.brake();
  }
});

process.stdin.setRawMode(true);
process.stdin.resume();
