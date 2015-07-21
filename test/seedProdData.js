var csv = require('csv');


var fs = require('fs');

var parser = csv.parse({delimiter: ';'}, function(err, data){
    console.log(data);
});

var files = [
    {
        name:"usersMay2210am.lst",
        date:"1432303200"
    },
    {
        name:"usersMay269am.lst",
        date:"1432645200"
    },
    {
        name:"usersJun083pm.lst",
        date:"1433790000"
    },
    {
        name:"usersJun1730am.lst",
        date:"1433156400"
    },
    {
        name:"usersJun123pm.lst",
        date:"1434135600"
    },

    {
        name:"usersJun1811am.lst",
        date:"1434639600"
    },
    {
        name:"usersJul02_815am.lst",
        date:"1435849200"
    },
    {
        name:"usersJul107am.lst",
        date:"1436526000"
    },
]



var LineByLineReader = require('line-by-line');
var userDataStore = require('../core/userDataStore.js');
var userDiff = require('../core/userDiff.js');

function processFile(index){
    if(index >= files.length){
        return;
    }

    var file = files[index];

    console.log("liz Processing file " + file.name);
    var lr = new LineByLineReader(__dirname+'/prodSeedData/'+ file.name);
    var users = [];
    lr.on('line', function (line) {
        //console.log(line.replace(";", "!"));
        var lineData = line.split(';');
        var user = {
            name: lineData[0],
            email: lineData[3],
            department: lineData[1],
            title: lineData[2],
            added: file.date,
            removed: null
        }
        users.push(user);

    });

    lr.on('end', function () {
        userDiff(users, userDataStore, function(){
            processFile(index+1);
        });

    });
}

setTimeout(function() {
processFile(0);
}, 1000);
