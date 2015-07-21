
var MongoClient = require('mongodb').MongoClient;

// Connection URL
var url = process.env.MONGO_DB;//'mongodb://192.168.99.100:32769/hiredorfired';
var userCollection = null;
if (url) {
    MongoClient.connect(url, function (err, db) {
        console.log("Connected correctly to MongoDB");
        userCollection = db.collection('users');
        //db.close();
    });
}

function findUser (email, callback){
    userCollection.findOne({email:email}, callback);
}

module.exports = {
    hasUser: function(email){

    },
    getAllUsers:function(callback){
        userCollection.find().toArray(function(err, users) {
            callback(users);
          });
    },
    addUser:function(user){
        userCollection.insertOne(user);
    },
    updateUser: function(user){
        userCollection.updateOne({email:user.email}, user);
    },
    onDataUpdated: function(callback){
        //Todo
    }
}
