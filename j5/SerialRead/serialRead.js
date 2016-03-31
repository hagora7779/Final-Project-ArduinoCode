var Board = require("firmata");
// replace the board address with yours (COM5 I believe)
var board = new Board("COM5", function() {
  console.log("ready");

  board.serialConfig({
    portId: 0x03, // HW_SERIAL3 == 0x03
    baud: 4800
  });

  var inString = [];

  board.serialRead(0x03, function(data) {
    inString.push(data);

    if (inString.length > 100) {
      console.log(JSON.stringify(inString));
      inString = [];
    }
  });

});
