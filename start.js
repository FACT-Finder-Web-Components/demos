var connect = require('connect');
var serveStatic = require('serve-static');
var port = require('./port');

var directory = "./";

connect().use(serveStatic(directory)).listen(port, function () {
    console.log('Server running on port ' + port + '...');
});

if (process.argv[2]) {
    require("open")("http://localhost:" + port + "/" + process.argv[2] + "/index.html");
}

