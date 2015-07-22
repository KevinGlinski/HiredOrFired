var app = module.exports = require('express')();
var logger = require('../../utils/traceLogger');

app.post('/testEndpoint', function(req, res){
    logger.log("RECEIVED SCHEDULER RSPONSE: " + JSON.stringify(req.body));
    res.sendStatus(200);
});