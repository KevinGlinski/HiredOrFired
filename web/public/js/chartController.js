hiredOrFired.controller('ChartController', function($scope, $rootScope, userService){
    var today = new Date();
    $scope.endDate = new Date();
    $scope.startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    $scope.interval = 'daily';
    console.log("chart controller")

    $scope.setInterval = function(interval){
        console.log(interval);
        $scope.interval = interval;
    }

    $scope.doRefresh = function(){
        refresh();
    }

    function refresh(){
        userService.getUsersPerInterval($scope.startDate, $scope.endDate, $scope.interval, function(data){
            $scope.labels = data.days;
            $scope.data = data.values;
            $scope.series = ['Employee Count']
        });
    }

    $scope.$watch('interval', function(newValue, oldValue){
        refresh();
    });


    $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
    $scope.series = ['Series A', 'Series B'];
    $scope.data = [
        [65, 59, 80, 81, 56, 55, 40],
        [28, 48, 40, 19, 86, 27, 90]
    ];
    $scope.onClick = function (points, evt) {
        console.log(points, evt);
    };
});
