var mongoClient = require('mongodb').MongoClient;
var userStore = require('./userDataStore');
var logger = require('../utils/traceLogger');
var request = require('request');

function RecurringScheduler() {
    var recurringRegistrants = [];
    var mongoConnectString = process.env.MONGO_DB;//'mongodb://192.168.99.100:32769/hiredorfired';
    var mongoCollectionName = "intervals";

    this.addRegistrant = function(serviceName, url, frequency, callback){
        logger.log("Added registrant " + serviceName + " at " + url + " with frequency " + frequency);
        recurringRegistrants.push(
            {
                name:serviceName,
                url: url,
                frequency: frequency,
                lastExecution: null
            }
        );
        callback("Successfully registered");
    };

    this.removeRegistrant = function(serviceName, callback){
        logger.log("Removing registrant " + serviceName);
        for(var i = 0; i < recurringRegistrants.length; i++){
            if (recurringRegistrants[i].name = serviceName){
                var url = recurringRegistrants[i].url;
                recurringRegistrants.splice(i, 1);
                callback("Successfully removed registrant " + serviceName + " at url " + url);
                return;
            }
        }
        callback("No service found with name " + serviceName);
    };


    function _onUserDataStoreUpdate(){
        logger.scope();
        //Check recurring registrants for things to send
        var newRegistrants = _findNewRegistrants();
        var dueRegistrants = _findDueRegistrants(Date.now());
        var registrantsToProcess = newRegistrants.concat(dueRegistrants);
        _processUpdatesForRegistrants(registrantsToProcess)
    }

    function _processUpdatesForRegistrants(registrants){
        logger.scope();
        registrants.forEach(function processForRegistrant(element){
            logger.log("Processing update for registrant by name "+ element.name );
            _getDataFromDaysAgo(element.frequency, function(data, err){
                if (err){
                    logger.log("Error getting data for notification. Not sending update to registrant");
                }
                logger.log("Sending notification to registrant by name "+ element.name );
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
                            element.lastExecution = Date.now();
                        }
                    });
                }
            });
        });
    }

    function _findNewRegistrants(){
        logger.scope();
        var newRegistrants = [];
        for (var i = 0; i < recurringRegistrants.length; i++) {
            if (recurringRegistrants[i]["lastExecution"] === null) {
                logger.log("Adding " + recurringRegistrants[i].name + " as new registrant to process");
                newRegistrants.push(recurringRegistrants[i]);
            }
        }
        return newRegistrants;
    }

    function _findDueRegistrants(dataDate){
        logger.scope();
        var dueRegistrants = [];
        recurringRegistrants.forEach(function(element, index, arr){
            var lastRanDate = element.lastExecution;
            if(lastRanDate) {
                var daysSinceExecution = _getDaysBetween(lastRanDate, dataDate);

                logger.log("Days Since: " + daysSinceExecution + " Target Days: " + element.frequency);
                if (daysSinceExecution == element.frequency) {
                    //We need to process
                    logger.log("Adding " + element.name + " as registrant to process");
                    dueRegistrants.push(element);
                }
            }
        });
        return dueRegistrants;
    }

    function _getDaysBetween(firstDate, secondDate){
        var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
        return Math.ceil(Math.abs((firstDate - secondDate)/(oneDay)));
    }

    function _getDataFromDaysAgo(numDays, callback) {
        logger.scope();
        mongoClient.connect(mongoConnectString, function mongoResult(err, db) {
            if (err) {
                logger.log(err);
                callback([], err);
            }
            var collection = db.collection(mongoCollectionName);

            var startDate = Date.now();//milliseconds since epoch
            startDate = parseFloat(startDate - (numDays * 86400000)); //convert days to milliseconds.
            logger.log("Getting intervals since " + startDate);
            var results = [];

            collection.find({"date": { $gte: startDate }}).toArray(function (err, results) {
                if (err) {
                    logger.log("Error : " + err);
                }
                logger.log("Found result set of length: " + results.length);
                if (results) {
                    return callback(results);
                }
                else callback([]);
            });
        });
    }

    userStore.onDataUpdated(_onUserDataStoreUpdate);
};

module.exports =  new RecurringScheduler ();