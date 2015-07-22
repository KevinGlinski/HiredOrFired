var mongoClient = require('mongodb').MongoClient;
var userStore = require('./userDataStore');
var logger = require('../utils/traceLogger');
var request = require('request');

function AgeBasedScheduler() {
    var ageBasedRegistrants = [];
    var mongoConnectString = process.env.MONGO_DB;//'mongodb://192.168.99.100:32769/hiredorfired';
    var mongoCollectionName = "intervals";

    this.addRegistrant = function(serviceName, url, age, callback){
        logger.log("Added registrant " + serviceName + " at " + url + " with trigger date " + age);
        ageBasedRegistrants.push(
            {
                name:serviceName,
                url: url,
                age: age
            }
        );
        callback("Successfully registered");
    };

    this.removeRegistrant = function(serviceName, callback){
        logger.log("Removing registrant " + serviceName);
        for(var i = 0; i < ageBasedRegistrants.length; i++){
            if (ageBasedRegistrants[i].name = serviceName){
                var url = ageBasedRegistrants[i].url;
                ageBasedRegistrants.splice(i, 1);
                callback("Successfully removed registrant " + serviceName + " at url " + url);
                return;
            }
        }
        callback("No service found with name " + serviceName);
    };

    function onUserDataStoreUpdate(){
        logger.scope();
        ageBasedRegistrants.forEach(function (element, index, arr) {
            _notifyRegistrants(element);
        });
    };

    function _notifyRegistrants(element) {
        logger.log("Checking registrant: " + element.name);

        var daysAgo = element.age;
        _getDataForPastDay(daysAgo, function(data, err){
            if (data.length > 0) {
                request({
                    url: element.url,
                    method: 'POST',
                    body: data,
                    json: true
                }, function (error, response, body) {
                    if (error) {
                        logger.log("Error: " + error);
                    } else {
                        logger.log("Successfully notified registrant " + element.name);
                    }
                });
            }
        });
    }

    function _getDataForPastDay(daysAgo, callback) {
        logger.log("Getting data from " + daysAgo + " days ago")

        if(!mongoConnectString){
            logger.log("No mongo url env variable set! Abort!")
            return;
        }

        mongoClient.connect(mongoConnectString, function (err, db) {
            if (err) {
                logger.log(err);
                return;
            }
            var collection = db.collection(mongoCollectionName);
            var oneDayMilliSeconds = 86400000;
            var startDate = Date.now();//milliseconds since epoch
            startDate = startDate - (startDate % oneDayMilliSeconds); //This is the previous midnight.
            startDate = parseFloat(startDate - (daysAgo * oneDayMilliSeconds)); //convert days to seconds.
            logger.log("Getting intervals since " + startDate);

            collection.find({"date": {$gt: startDate, $lt: startDate + oneDayMilliSeconds}}).toArray(function(err, results){
                if (err){
                    logger.log("Error : " + err);
                }
                logger.log("Found result set of length: " + results.length);
                if(results) {
                    callback(results);
                }
                else callback([]);
            });
        });
    }

    userStore.onDataUpdated(onUserDataStoreUpdate);
};

module.exports =  new AgeBasedScheduler ();
