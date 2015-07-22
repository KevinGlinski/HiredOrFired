var csv = require('csv');


var fs = require('fs');

var parser = csv.parse({delimiter: ';'}, function(err, data){
    console.log(data);
});

var files = [
    {
        name:"usersMay2210am.lst",
        date:new Date(2015,4,22,10)
    },
    {
        name:"usersMay269am.lst",
        date:new Date(2015,4,26,9)
    },

    {
        name:"usersJun1730am.lst",
        date:new Date(2015,5,1,7)
    },
    {
        name:"usersJun083pm.lst",
        date:new Date(2015,5,8,15)
    },
    {
        name:"usersJun123pm.lst",
        date: new Date(2015,5,12,15)
    },

    {
        name:"usersJun1811am.lst",
        date:new Date(2015,5,18,11)
    },
    {
        name:"usersJul02_815am.lst",
        date:new Date(2015,6,2,8)
    },
    {
        name:"usersJul107am.lst",
        date:new Date(2015,6,10,7)
    },
]



var LineByLineReader = require('line-by-line');
var userDataStore = require('../core/userDataStore.js');
var userDiff = require('../core/userDiff.js');

function processFile(index){
    if(index >= files.length){
        return;
    }

    var userFile = files[index];

    console.log("Processing file " + userFile.name + " " + userFile.date);
    var lr = new LineByLineReader(__dirname+'/prodSeedData/'+ userFile.name);
    var users = [];
    lr.on('line', function (line) {
        //console.log(line.replace(";", "!"));
        var lineData = line.split(';');
        var user = {
            name: lineData[0],
            email: lineData[3],
            department: lineData[1],
            title: lineData[2],
            metaAdded: JSON.stringify(userFile.date),
            added: userFile.date.getTime(),
            removed: null
        }

        console.log(lineData[3] + "- "+ userFile.date + ' - ' + userFile.name)

        users.push(user);

    });

    lr.on('end', function () {
        userDiff(users, userDataStore, function(){
            processFile(index+1);
        }, userFile.date.getTime());

    });

    console.log(users);
}

setTimeout(function() {
processFile(0);
}, 1000);
