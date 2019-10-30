const connect = require('connect');
const serveStatic = require('serve-static');
const port = require('./port');

const directory = "./";

connect().use(serveStatic(directory)).listen(port, function () {
    console.log('Server running on port ' + port + '...');
});

if (process.argv[2]) {
    require("open")("http://localhost:" + port + "/" + process.argv[2] + "/index.html");
}

