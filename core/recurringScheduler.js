var mongoClient = require('mongodb').MongoClient;
var userStore = require('./userDataStore');
var logger = require('../utils/traceLogger');

function RecurringScheduler() {
    var recurringRegistrants = [];
    var mongoConnectString = process.env.MONGO_DB;//'mongodb://192.168.99.100:32769/hiredorfired';
    var mongoCollectionName = "users";

    this.addRecurrentRegistrant = function(serviceName, url, frequency, callback){
        logger.log("Added registrant " + serviceName + " at " + url + " with frequency " + frequency);
        recurringRegistrants.add(
            {
                name:serviceName,
                url: url,
                frequency: frequency,
                lastExecution: null
            }
        );
    };

    function _onUserDataStoreUpdate(data){
        logger.scope();
        //Check recurring registrants for things to send
        var newRegistrants = _findNewRegistrants();
        var dueRegistrants = _findDueRegistrants(data.date);
        var registrantsToProcess = newRegistrants.concat(dueRegistrants);
        _processUpdatesForRegistrants(registrantsToProcess)
    }

    function _processUpdatesForRegistrants(registrants){
        logger.scope();
        registrants.forEach(function processForRegistrant(element){
            var data = _getDataFromDaysAgo(element.frequency);

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

    function _findNewRegistrants(){
        logger.scope();
        var newRegistrants = [];
        for (var i = 0; i < recurringRegistrants.length; i++) {
            if (recurringRegistrants[i]["lastExecution"] === null) {
                logger.log("Adding " + recurringRegistrants[i].name + " as new registrant to process");
                newRegistrants.add(recurringRegistrants[i]);
            }
        }
        return newRegistrants;
    }

    function _findDueRegistrants(dataDate){
        logger.scope();
        var dueRegistrants = [];
        recurringRegistrants.forEach(function(element, index, arr){
            var lastRanDate = element.lastExecution;
            var daysSinceExecution = _getDaysBetween(lastRanDate, dataDate);

            logger.log("Days Since: " + daysSinceExecution + " Target Days: " + element.frequency);
            if(daysSinceExecution == element.frequency){
                //We need to process
                logger.log("Adding " + element.name + " as registrant to process");
                dueRegistrants.add(element);
            }
        });
        return dueRegistrants;
    }

    function _getDaysBetween(firstDate, secondDate){
        var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
        return Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
    }

    function _getDataFromDaysAgo(numDays) {
        mongoClient.connect(mongoConnectString, function (err, db) {
            if (err) {
                return logger.log(err);
            }
            var collection = db.collection(mongoCollectionName);

            var startDate = new Date();
            startDate.setDate(startDate.getDate() - numDays);

            collection.find({"date": { $gte: startDate }}).toArray(function (err, results) {
                if (err) {
                    logger.log("Error : " + err);
                }
                logger.log("Found result set of length: " + results.length);
                if (results) {
                    return results;
                }
                else return [];
            });
        });
    }

    userStore.onDataUpdated(_onUserDataStoreUpdate);
};

module.exports =  new RecurringScheduler ();