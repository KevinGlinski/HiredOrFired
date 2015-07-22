var request = require('request');
var userDiff = require('./userDiff.js');
var logger = require('../utils/traceLogger');

var base_uri = "https://public--api-us--east--1-inindca-com-7a1o6tnlzr5h.runscope.net" ;
//var base_uri =  "https://public-api.us-east-1.ininsca.com";
var sessionId = null;
var userDataStore = null;

function login(user, password, successCallback, failureCallback){

    request({
        url: base_uri + "/api/v1/auth/sessions",
        method: 'POST',
        body: {
                 userIdentifier: user,
                 password: password
             },
        json: true
    }, function(error, response, body){
        if(error) {
            console.error(error);
            if(failureCallback){
                failureCallback();
            }
        } else {
            if(successCallback){
                sessionId = response.body.id;
                successCallback(response.body.id);
            }
        }
    });
}

function getPureCloudUsers(callback){
    var userList = [];

    function fetchUsers(uri)
    {
        console.log(uri);
        request({
            url: uri,
            method: 'GET',
            headers: {
                'Authorization': 'bearer ' + sessionId
            },
            json: true
        }, function(error, response, body){
            if(error) {
                console.error(error);

            } else {
                userList = userList.concat(response.body.entities);
                if(response.body.pageCount != response.body.pageNumber){
                    fetchUsers(response.body.nextUri);
                }  else{

                    if(callback){

                        callback(userList);
                    }
                }
            }
        });
    }

    fetchUsers(base_uri + "/api/v1/users");
}

function diffUsers(){
    logger.log("checking users");

    getPureCloudUsers(function(pureCloudUsers){
        userDiff(pureCloudUsers, userDataStore);

    });
}

module.exports = {
    init: function(userData, user, password){
        userDataStore = userData;

        if(user == null || password == null || user == "" || password == ""){
            logger.log("PureCloud user or password is not set!");
            return;
        }

        login(user,password, function(sessionId){
            var interval = setInterval(function() {
              diffUsers();
          }, 10000);
        })
    }
}
