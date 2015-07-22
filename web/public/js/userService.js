hiredOrFired.factory('userService', function ($http) {

    return{
        getUsersForMonth: function(year, month, callback){

            $http.get('/users?year='+year +'&month='+ month).
            success(function(data, status, headers, config) {
                callback(data);
            }).
            error(function(data, status, headers, config) {
            });
        },
        getUsersPerInterval:function(startDate, endDate, interval, callback){
            $http.get('/usersperinterval?start='+startDate +'&end='+ endDate +'&interval=' + interval).
            success(function(data, status, headers, config) {
                callback(data);
            }).
            error(function(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
        }
    }
});
