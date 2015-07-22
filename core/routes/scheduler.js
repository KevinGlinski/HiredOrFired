var app = module.exports = require('express')();
var ageScheduler = require('../ageBasedScheduler');
var recurringScheduler = require('../recurringScheduler');
var logger = require('../../utils/traceLogger');

app.post('/schedule/age/:age', function(req, res){
    logger.log(JSON.stringify(req.body));
    var request = req.body;
    var serviceName = request.serviceName;
    var url = request.url;

    function callback(response) {
        res.send(response);
    }

    ageScheduler.addRegistrant(serviceName, url, req.params.age, callback);
});

app.post('/schedule/age/', function _addAgeScheduler(req, res){
    logger.log(JSON.stringify(req.body));
    var request = req.body;
    var serviceName = request.serviceName;
    var url = request.url;
    var age = request.age;

    function callback(response) {
        res.send(response);
    }

    ageScheduler.addRegistrant(serviceName, url, age, callback);
});

app.delete('/schedule/age/', function _removeAgeScheduler(req, res){
    logger.log(JSON.stringify(req.body));
    var request = req.body;
    var serviceName = request.serviceName;

    function callback(response) {
        res.send(response);
    }

    ageScheduler.removeRegistrant(serviceName, callback);
});

app.post('/schedule/recurring/:frequency', function(req, res){
    logger.log(JSON.stringify(req.body));
    var request = req.body;
    var serviceName = request.serviceName;
    var url = request.url;

    function callback(response) {
        res.send(response);
    }

    recurringScheduler.addRegistrant(serviceName, url, req.params.frequency, callback);
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

    recurringScheduler.addRegistrant(serviceName, url, frequency, callback);
});

app.delete('/schedule/recurring/', function _removeRecurringScheduler(req, res){
    logger.log(JSON.stringify(req.body));
    var request = req.body;
    var serviceName = request.serviceName;

    function callback(response) {
        res.send(response);
    }

    recurringScheduler.removeRegistrant(serviceName, callback);
});