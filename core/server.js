var http = require("http");
var bodyParser = require('body-parser');
url = require("url"),
path = require("path"),
express = require('express'),
purecloud = require('./purecloud.js')
userDataStore = require('./userDataStore.js');

var scheduler = require('./routes/scheduler');

if (process.env.MONGO_DB == null){
    process.env['MONGO_DB'] = "mongodb://" + process.env.DB_PORT_27017_TCP_ADDR + "/hiredorfired"
}

var app = express();

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(scheduler);
app.use(require('./routes/testRoutes'));

app.set('port', (process.env.PORT || 8088));

var httpServer = http.createServer(app);

console.log('logging into purecloud');
purecloud.init(userDataStore, process.env.PURECLOUD_USER, process.env.PURECLOUD_PASSWORD);

httpServer.listen(app.get('port'));
