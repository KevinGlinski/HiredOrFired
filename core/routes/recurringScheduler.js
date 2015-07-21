var app = module.exports = require('express')();
var scheduler = require('../recurringScheduler');
var logger = require('../../utils/traceLogger');

app.post('/schedule/recurring/:frequency', function(req, res){
    logger.log(JSON.stringify(req.body));
    var request = req.body;
    var serviceName = request.serviceName;
    var url = request.url;

    function callback(response) {
        res.send(response);
    }

    scheduler.addRecurrentRegistrant(serviceName, url, req.params.frequency, callback);
});

app.post('/schedule/recurring/', function _addRecurringScheduler(req, res){
    logger.log(JSON.stringify(req.body));
    var request = req.body;
    var serviceName = request.serviceName;
    var url = request.url;
    var frequency = request.frequency;

    function callback(response) {
        res.send(response);
    }

    scheduler.addRecurrentRegistrant(serviceName, url, frequency, callback);
});
