var five = require("johnny-five");
var board = new five.Board();

board.on("ready", function() {
    /*
     * This is the simplest initialization
     * We assume SW_SERIAL0 for the port
     */
     console.log(this.io.SERIAL_PORT_IDs.HW_SERIAL3);
     console.log(typeof this.io.SERIAL_PORT_IDs.HW_SERIAL3);
    var gps = new five.GPS({
        port: 3,
        baud: 4800
    });

    // If latitude, longitude, course or speed change log it
    gps.on("change", function() {
        console.log("position");
        console.log("  latitude   : ", this.latitude);
        console.log("  longitude  : ", this.longitude);
        console.log("--------------------------------------");
    });
    gps.on("sentence", function(data) {
        console.log("sentence", data);
    });
});
