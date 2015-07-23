hiredOrFired.controller('ChartController', function($scope,$timeout, $rootScope, userService){
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

            var days=[];
            var values =[];

            var sum =0;

            for(var x= 0; x< data.length; x++){
                if(x != data.length -1){
            //

                    var date = new Date(data[x].day);
                    var nextdate =  new Date(data[x+1].day);

                    if(date.getTime() == nextdate.getTime()){
                        days.push(new Date(data[x].day).toDateString());
                        values.push(sum + data[x+1].count + data[x].count);
                        x++;
                    }else{
                        days.push(new Date(data[x].day).toDateString());
                        values.push(sum + data[x].count);
                    }

                            sum += data[x].count;
                }

            }


            $scope.labels = days;
            $scope.data = [values];
            $scope.series = ['Employee Count']
        });
    }

    $scope.$watch('interval', function(newValue, oldValue){
        refresh();
    });
    
});
