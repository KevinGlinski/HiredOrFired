var MongoClient = require('mongodb').MongoClient;

// Connection URL
var url = process.env.MONGO_DB;//'mongodb://192.168.99.100:32769/hiredorfired';
var userCollection = null;
var intervalCollection = null;

MongoClient.connect(url, function(err, db) {
    console.log("Connected correctly to MongoDB");
    userCollection = db.collection('users');
    userCollection.removeMany();
    intervalCollection = db.collection('intervals');
    intervalCollection.removeMany();
    db.close();
});
