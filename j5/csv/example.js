var csv = require('csv-write-stream');
var fs = require('fs');
var writer = csv({ headers: ["timestamp","output", "input", "setpoint", "setdegree"]});
writer.pipe(fs.createWriteStream('out.csv'))
writer.write(['world', 'bar'])
writer.end()
