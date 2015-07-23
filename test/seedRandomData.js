
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
var index = 0
var date = 1420070400000;
for(var x=1; x<initialCount; x++){
    //add start users
    var user = addUser(array[x], date);
    users.push(user);
    index = x;
}

console.log(date)
while(date < 1441065600000 && index< 9998){
    date += 86400000

    for(var x=0; x<random(0,7); x++){
        index++
        var user = addUser(array[index], date);
        users.push(user);
    }

    for(var x=0; x<random(0,2);x++){
        var removeIndex = random(initialCount + 1,users.length-1);
        //console.log('removing user at ' + removeIndex)
        users[removeIndex].removed = date;
    }
}

var MongoClient = require('mongodb').MongoClient;
var url = process.env.MONGO_DB;

console.log("connecting to database");
MongoClient.connect(url, function (err, db) {

    userCollection = db.collection('users');

    for(var u in users){
        console.log(users[u])
            userCollection.insertOne(users[u])
    }

    console.log("inserting users")

    db.close();


});
