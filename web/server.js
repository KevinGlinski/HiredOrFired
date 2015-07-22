var http = require("http");
url = require("url"),
path = require("path"),
fs = require("fs")
var express = require('express');
var app = express();

var MongoClient = require('mongodb').MongoClient;


app.use(express.static(__dirname +'/public'));

function getUsersForInterval(users, start, end, interval, callback){

    db.collection.aggregate(
        {$project: {
            ageLowerBound: {$subtract:["$age", {$mod:["$age",2]}]}}
        },
        {$group: {
            _id:"$ageLowerBound",
            count:{$sum:1}
        }
    })
    /*
    var scalar = 0;
    var MILLISECONDS_IN_A_DAY = 86400000;
    switch (interval) {
    case 'daily':
    scalar = MILLISECONDS_IN_A_DAY;
    break;
    case 'weekly':
    scalar = MILLISECONDS_IN_A_DAY * 7
    break;
    case 'monthly':
    break;
    default:

    }

    var endOfInterval = start.getTime() + scalar;
    if(endInterval > end){
    endInterval = end;
    }

    userCollection.count( {added: { $gt: start.getTime(), $lt: end.getTime()}} , function(err, count) {
    console.log(count + " users")
    //console.log("starting with " + users.length);
    dayPoints.push(startDate);
    valuePoints.push(count);

    getUsersForInterval(startDate, )
    res.send({
    days: dayPoints,
    values: valuePoints
    });
    });
    */
}

app.get('/usersperinterval', function (req,res){
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;

    console.log(query);

    var startDate = new Date(query.start);
    var endDate = new Date(query.end);

    var dbUrl = process.env.MONGO_DB;

    MongoClient.connect(dbUrl, function (err, db) {
        var userCollection = db.collection('users');

        var resultDays = [];
        var resultValues = [];

        userCollection.count( {added: { $lt: startDate.getTime()}} , function(err, count) {
            resultDays.push(startDate);
            resultValues.push(count);

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

                if(docs == null) {

                    db.close();
                    res.send({
                        days: resultDays,
                        values: resultValues
                    });
                }else{
                    console.log("each")
                    console.log(docs)

                    resultDays.push(new Date(docs["_id"].addedday.year, docs["_id"].addedday.month, docs["_id"].addedday.day));
                    resultValues.push(docs.count);


                }
            });
        });

    });

});

app.get('/users', function (req, res) {
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;

    var startDate = new Date(query.year.valueOf(), query.month.valueOf(), 1);
    var endDate = new Date(query.year.valueOf(), query.month.valueOf() +1 , 1);
    console.log(startDate + " to " +endDate )
    var dbUrl = process.env.MONGO_DB;

    MongoClient.connect(dbUrl, function (err, db) {
        var userCollection = db.collection('users');

        userCollection.find( {
            $or:[
                { added: { $gt: startDate.getTime(), $lt: endDate.getTime() } },
                { removed: { $gt: startDate.getTime(), $lt: endDate.getTime() } }
            ]
        }).toArray(function(err, users) {
            //userCollection.find({ added: { $gt: startDate.getTime()} }).toArray(function(err, users) {
            console.log("returning")
            console.log(users.length);
            res.send(users);

            db.close();
        });

    });


});

app.set('port', (process.env.PORT || 8080));

var httpServer = http.createServer(app);
httpServer.listen(app.get('port'));
