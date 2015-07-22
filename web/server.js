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

    //var startDate = new Date(query.start);
    //var endDate = new Date(query.end);

    var startTime = new Date(2014,5,1);
    var endTime = new Date(2016,6,1);

    var dbUrl = process.env.MONGO_DB;

    MongoClient.connect(dbUrl, function (err, db) {
        var userCollection = db.collection('users');

        var results=[];
        var cursor = userCollection.aggregate(
            [
                { $match : { "added" : { $gte : startTime.getTime(), $lt: endTime.getTime() } } },
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
                        "count": { "$sum": 1 },


                    }
                },
                {$sort:{"count":1}}

            ]
        )


        cursor.each(function(err, docs) {
            if(docs == null) {
                var removedResults =[];

                var removedcursor = userCollection.aggregate(
                    [
                        { $match : {
                            $and:
                                [
                                    {"removed" : { $gte : startTime.getTime(), $lt: endTime.getTime() }}
                                ]
                            }
                        },
                        {
                            $group: {
                                _id: {
                                    addedday: {
                                        month: { $month: {
                                            $add : [ new Date(0), "$removed"]
                                        } },
                                        day: { $dayOfMonth: {
                                            $add : [ new Date(0), "$removed"]
                                        } },
                                        year: { $year: {
                                            $add : [ new Date(0), "$removed"]
                                        }}
                                    }
                                } ,
                                "count": { "$sum": 1 },


                            }
                        },
                        {$sort:{"count":1}}

                    ]
                )


                removedcursor.each(function(err, docs) {
                    if(docs == null) {

                        db.close();

                        results.sort(function(a,b){
                            return a.day > b.day;
                        });

                        console.log(results);
                        res.send(results);

                    }else{
                    //    console.log("each")
                        //console.log(docs)

                        results.push({day: new Date(docs["_id"].addedday.year, docs["_id"].addedday.month-1, docs["_id"].addedday.day), count: docs.count * -1});
                    }
                });


            }else{
                //console.log("each")
            //    console.log(docs)

                results.push({day: new Date(docs["_id"].addedday.year, docs["_id"].addedday.month-1, docs["_id"].addedday.day), count: docs.count});
            }
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
