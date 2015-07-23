
var fs = require('fs');
var array = fs.readFileSync(__dirname+'/prodSeedData/'+ 'WeatherPhoneLargeContactList.csv').toString().split("\n");

var initialCount = 300;

function random (low, high) {
    return Math.round(Math.random() * (high - low) + low);
}


function addUser(row, date){
    var lineData = row.split(',');
    var user = {
        name: lineData[4] + ' ' + lineData[6],
        email: lineData[14],
        department: 'Sales',
        title: lineData[32],
        added: date,
        removed: null
    }
    return user;
}

var users = [];
var intervals = [];
var hiredList = [];
var firedList = [];
var index = 0
var date = 1420070400000;// Jan 1, 2015
for(var x=1; x<initialCount; x++){
    //add start users
    var user = addUser(array[x], date);
    users.push(user);
    hiredList.push(user);
    index = x;
}

intervals.push({
    date : date,
    hired : hiredList,
    fired : firedList
});

console.log(date)
//1 run for each day until Sept 1, 2015
while(date < 1441065600000 && index< 9998){
    date += 86400000
    hiredList = [];
    firedList = [];

    for(var x=0; x<random(0,7); x++){
        index++
        var user = addUser(array[index], date);
        users.push(user);
        hiredList.push(user);
    }

    for(var x=0; x<random(0,2);x++){
        var removeIndex = random(initialCount + 1,users.length-1);
        //console.log('removing user at ' + removeIndex)
        users[removeIndex].removed = date;
        firedList.push(users[removeIndex]);
    }

    intervals.push({
        date : date,
        hired : hiredList,
        fired : firedList
    });
}

var MongoClient = require('mongodb').MongoClient;
var url = process.env.MONGO_DB;

console.log("connecting to database");
MongoClient.connect(url, function (err, db) {

    var userCollection = db.collection('users');
    var intervalCollection = db.collection('intervals');

    console.log("inserting users");
    for(var u in users){
        console.log(users[u]);
        userCollection.insertOne(users[u]);
    }
    console.log("finished inserting users");
    console.log("inserting intervals");
    for(var i in intervals){
        console.log(intervals[i]);
        intervalCollection.insertOne(intervals[i]);
    }
    console.log("finished inserting intervals");

    db.close();
});
