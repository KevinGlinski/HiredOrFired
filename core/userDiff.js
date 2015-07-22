module.exports = function(pureCloudUsers, userDataStore, callback, endDate){
        userDataStore.getAllUsers(function(userStoreUsers){
            for (var p=0;p<pureCloudUsers.length; p++){
                var pureCloudUser = pureCloudUsers[p];
                var foundUserInDataStore = false;

                for (var d=0;d<userStoreUsers.length; d++){
                    var userStoreUser = userStoreUsers[d];
                    if(userStoreUser.email.toLowerCase() == pureCloudUser.email.toLowerCase() ){
                        foundUserInDataStore = true;
                        userStoreUsers.splice(d,1);
                        d = userStoreUser.length + 1;

                    }
                }

                if(!foundUserInDataStore){
                    console.log("adding new user " + pureCloudUser.email);
                    if(!pureCloudUser.added){
                        pureCloudUser.added = Date.now().getTime();
                    }

                    pureCloudUser.removed = null;
                    userDataStore.addUser(pureCloudUser);
                }
            }

            for (var d=0;d<userStoreUsers.length; d++){
                var userStoreUser = userStoreUsers[d];
                if(userStoreUser.removed == null)
                {
                    console.log("user deleted " + userStoreUser.email);
                    if(endDate){
                        userStoreUser.removed = endDate;
                    }
                    else{
                        userStoreUser.removed = new Date().getTime();
                    }
                    userDataStore.updateUser(userStoreUser);
                }
            }

            if(callback){
                callback();
            }
            userDataStore.updateCompleted();
        });
    };
