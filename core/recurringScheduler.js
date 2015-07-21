var userStore = require('./userDataStore');
var logger = require('../utils/traceLogger');

function RecurringScheduler() {
    var recurringRegistrants = [];

    this.addRecurrentRegistrant = function(serviceName, url, frequency, callback){
        logger.log("Added registrant " + serviceName + " at " + url + " with frequency " + frequency);
        recurringRegistrants.add(
            {
                name:serviceName,
                url: url,
                frequency: frequency,
                callback: callback,
                lastExecution: null
            }
        );
    };

    function onUserDataStoreUpdate(data){
        logger.scope();
        //Check recurring registrants for things to send
        var newRegistrants = _findNewRegistrants();
        var dueRegistrants = _findDueRegistrants(data.date);
    };

    function _findNewRegistrants(){
        var newRegistrants = [];
        for (var i = 0; i < recurringRegistrants.length; i++) {
            if (recurringRegistrants[i]["lastExecution"] === null) {
                newRegistrants.add(recurringRegistrants[i]);
            }
        }
        return newRegistrants;
    }

    function _findDueRegistrants(dataDate){
        var dueRegistrants = [];
        recurringRegistrants.forEach(function(element, index, arr){
            var lastRanDate = element.lastExecution;
            var daysSinceExecution = _getDaysBetween(lastRanDate, dataDate);
            if(daysSinceExecution == element.frequency){
                //We need to process

            }
        })
    }

    function _getDaysBetween(firstDate, secondDate){
        var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
        return Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
    }


        mongoClient.connect(mongoConnectString, function (err, db) {
            if (err) {
                return logger.log(err);
            }
            var collection = db.collection(mongoCollectionName);

            var startDate = new Date();
            startDate.setDate(startDate.getDate() - daysAgo);

            collection.find({"date": { $gte: startDate }}).toArray(function(err, results){
                if (err){
                    logger.log("Error : " + err);
                }
                logger.log("Found result set of length: " + results.length);
                if(results) {
                    return results;
                }
                else return [];
            });
        });

   // userStore.onDataUpdate(onUserDataStoreUpdate);
};

module.exports =  new RecurringScheduler ();