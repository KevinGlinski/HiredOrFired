var http = require("http");
url = require("url"),
path = require("path"),
express = require('express'),
purecloud = require('./purecloud.js')
userDataStore = require('./userDataStore.js');

var recurringScheduler = require('./recurringScheduler');
var ageScheduler = require('./ageBasedScheduler');

var app = express();

app.use(express.static(__dirname));

app.set('port', (process.env.PORT || 8080));

var httpServer = http.createServer(app);

console.log('logging into purecloud');
purecloud.init(userDataStore, process.env.PURECLOUD_USER, process.env.PURECLOUD_PASSWORD);

//httpServer.listen(app.get('port'));
