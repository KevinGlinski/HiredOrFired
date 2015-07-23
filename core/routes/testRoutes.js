var app = module.exports = require('express')();
var userStore = require('../userDataStore');
var logger = require('../utils/traceLogger');

app.post('/testEndpoint', function(req, res){
    logger.log("RECEIVED SCHEDULER RSPONSE: " + JSON.stringify(req.body));
    res.sendStatus(200);
});

app.post('/forceTrigger', function(req, res){
    logger.log("Forcing trigger");
    userStore.updateCompleted();
    res.sendStatus(200);
});
