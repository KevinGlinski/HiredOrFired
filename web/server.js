var http = require("http");
url = require("url"),
path = require("path"),
fs = require("fs")
var express = require('express');
var app = express();

var MongoClient = require('mongodb').MongoClient;


app.use(express.static(__dirname +'/public'));

app.get('/usersperinterval', function (req,res){
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;

    console.log(query);

    var startTime = new Date(query.start);
    var endTime = new Date(query.end);

    //var startTime = new Date(2014,5,1);
    //var endTime = new Date(2016,6,1);

    var dbUrl = process.env.MONGO_DB;

    var results = [];

    MongoClient.connect(dbUrl, function (err, db) {
        var intervalCollection = db.collection('intervals');
        var userCollection = db.collection('users');

        var results=[];

        var intervalFilter = { "date" : { $gte : startTime.getTime(), $lt: endTime.getTime() } };
        console.log(intervalFilter);
        var cursor = intervalCollection.find(intervalFilter).toArray(function(err, intervals) {
            userCollection.count( { $and : [{"added":{$lt : startTime.getTime() }}, {"removed": {$eq: null}}  ]}, function(err, startcount) {

                for(var x=0;x<intervals.length; x++){
                    var interval = intervals[x];

                    console.log(interval)
                    var delta = interval.hired.length - interval.fired.length
                    console.log(delta);

                    if(x==0){
                        delta += startcount;
                    }

                    results.push({
                        day: new Date(interval.date),
                        count: delta
                    });

                }

                results = results.sort(function(a,b){

                    //return a.day.getTime() > b.day.getTime();
                    a = new Date(a.day);
                    b = new Date(b.day);
                    return a<b ? -1 : a>b ? 1 : 0;
                });
                res.send(results);
                db.close();
            });
        });


    });
});


app.get('/users', function (req, res) {
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    console.log(query);
    var year = parseInt(query.year);
    var month = parseInt(query.month);
    var nextMonth = month +1;

    var startDate = new Date(year, month +1, 1,0,0,0);
    var endDate = new Date(year, nextMonth +1 , 1,0,0,0);
    //console.log(startDate.getYear());
//    startDate = new Date(startDate.getYear(), startDate.getMonth(), 1);
    //var endDate = new Date(year, nextMonth , 1,0,0,0);
    //startDate = new Date(0).setTime(startDate);
//    var endDate = startDate;// month.setMonth(month.getMonth() + 1);
//    endDate.setMonth(endDate.getMonth() + 1);
    console.log(year)
    console.log(month)
    console.log(nextMonth)
    console.log(JSON.stringify(startDate) + " to " + JSON.stringify(endDate ))
    var dbUrl = process.env.MONGO_DB;

    MongoClient.connect(dbUrl, function (err, db) {
        var userCollection = db.collection('users');

        userCollection.find( {
            $or:[
                { added: { $gte: startDate.getTime(), $lt: endDate.getTime() } },
                { removed: { $gte: startDate.getTime(), $lt: endDate.getTime() } }
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
