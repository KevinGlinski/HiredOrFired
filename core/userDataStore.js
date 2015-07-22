var logger = require('../utils/traceLogger');
var MongoClient = require('mongodb').MongoClient;

// Connection URL
var url = process.env.MONGO_DB;//'mongodb://192.168.99.100:32769/hiredorfired';
var userCollection = null;
var intervalCollection = null;
var updateListeners = [];

if (url) {
    logger.log("Attempting mongo connection");
    MongoClient.connect(url, function (err, db) {
        logger.log("Connected correctly to MongoDB");
        userCollection = db.collection('users');
        intervalCollection = db.collection('intervals');
        //db.close();
    });
}

function findUser (email, callback){
    if(userCollection) {
        userCollection.findOne({email: email}, callback);
    }
}

module.exports = {
    hasUser: function(email){

    },
    getAllUsers:function(callback){
        if(userCollection) {
            userCollection.find().toArray(function (err, users) {
                callback(users);
            });
        }
    },
    addUser:function(user){
        userCollection.insertOne(user);
    },
    updateUser: function(user){
        userCollection.updateOne({email:user.email}, user);
    },
    onDataUpdated: function(callback){
        updateListeners.push(callback);
    },
    addInterval: function(interval){
        intervalCollection.insertOne(interval);
    },
    updateCompleted: function(){
        updateListeners.forEach(function(element, index, arr){
            element();
        });
    }
}