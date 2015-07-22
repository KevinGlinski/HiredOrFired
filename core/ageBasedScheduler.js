var mongoClient = require('mongodb').MongoClient;
var userStore = require('./userDataStore');
var logger = require('../utils/traceLogger');

function AgeBasedScheduler() {
    var ageBasedRegistrants = [];
    var mongoConnectString = process.env.MONGO_DB;//'mongodb://192.168.99.100:32769/hiredorfired';
    var mongoCollectionName = "users";

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

    function onUserDataStoreUpdate(data){
        logger.scope();
        ageBasedRegistrants.forEach(function (element, index, arr) {
            _notifyRegistrants(element, data);
        });
    };

    function _notifyRegistrants(element, data) {
        logger.log("Checking registrant: " + element.name);

        var daysAgo = element.age;
        var data = _getDataForPastDay(daysAgo);

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
    }

    function _getDataForPastDay(daysAgo) {
        logger.log("Getting data from " + daysAgo + " days ago")

        if(!mongoConnectString){
            logger.log("No mongo url env variable set! Abort!")
            return;
        }

        mongoClient.connect(mongoConnectString, function (err, db) {
            if (err) {
                return logger.log(err);
            }
            var collection = db.collection(mongoCollectionName);

            var startDate = new Date();
            startDate.setDate(startDate.getDate() - daysAgo);

            collection.find({"date": startDate }).toArray(function(err, results){
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
    }

    userStore.onDataUpdated(onUserDataStoreUpdate);
};

module.exports =  new AgeBasedScheduler ();
