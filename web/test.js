
var MongoClient = require('mongodb').MongoClient;


var dbUrl = process.env.MONGO_DB;

var startTime = new Date(2015,5,1);
var endTime = new Date(2015,6,1);

function createAggregate(parameter){
    return [
        { $match : {parameter : { $gte : startTime.getTime(), $lt: endTime.getTime() }}},
        {
            $group: {
                _id: {
                    addedday: {
                        month: { $month: {
                            $add : [ new Date(0), "$added" ]
                        } },
                        day: { $dayOfMonth: {
                            $add : [ new Date(0), "$added" ]
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

    ];
}
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

                }else{
                    console.log("each")
                    //console.log(docs)

                    results.push({day: new Date(docs["_id"].addedday.year, docs["_id"].addedday.month-1, docs["_id"].addedday.day), count: docs.count * -1});
                }
            });


        }else{
            console.log("each")
        //    console.log(docs)

            results.push({day: new Date(docs["_id"].addedday.year, docs["_id"].addedday.month-1, docs["_id"].addedday.day), count: docs.count});
        }
    });
});
