var port = require('./port');
require("open")("http://localhost:" + port + "/" + process.argv[2] + "/index.html");