var app = module.exports = require('express')();
var scheduler = require('../ageBasedScheduler');
var logger = require('../../utils/traceLogger');

app.post('/schedule/age/:age', function(req, res){
    logger.log(JSON.stringify(req.body));
    var request = req.body;
    var serviceName = request.serviceName;
    var url = request.url;

    function callback(response) {
        res.send(response);
    }

    scheduler.addAgeBasedRegistrant(serviceName, url, req.params.age, callback);
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

    scheduler.addAgeBasedRegistrant(serviceName, url, age, callback);
});
