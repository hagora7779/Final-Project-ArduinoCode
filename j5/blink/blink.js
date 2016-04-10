var five = require("johnny-five");
var board = new five.Board();

board.on("ready", function() {
  var led = new five.Led(13);
  setTimeout(function(){
    led.on();
  },2500);
  setTimeout(function(){
    led.off();
  },1000);
});
