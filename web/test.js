
var MongoClient = require('mongodb').MongoClient;


var dbUrl = process.env.MONGO_DB;

MongoClient.connect(dbUrl, function (err, db) {
    var userCollection = db.collection('users');


    var cursor = userCollection.aggregate(
        [
            {
                $group: {
                    _id: {
                        addedday: {
                            month: { $month: {
                                $add : [ new Date(0), "$added"]
                            } },
                            day: { $dayOfMonth: {
                                $add : [ new Date(0), "$added"]
                            } },
                            year: { $year: {
                                $add : [ new Date(0), "$added"]
                            }}
                        }
                    } ,
                    "count": { "$sum": 1 }

                }
            }

        ]
    )

    cursor.each(function(err, docs) {
        console.log("each")
        console.log(docs)

        if(docs == null) {
            db.close();
        }
    });

});
