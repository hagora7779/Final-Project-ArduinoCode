var five = require("johnny-five");
var board = new five.Board();

board.on("ready", function() {
  var led = new five.Led(13);
  
  // led.blink(1500,function(){
  //   console.log("1500 on");
  // });
  // led2.blink(250,function(){
  //   console.log("250 on")
  // });
  setTimeout(function(){
    led.on();
  },2500);
  setTimeout(function(){
    led.off();
  },1000);
});
