hiredOrFired.controller('chartController', function($scope,$timeout, $rootScope, userService){
    var today = new Date();
    $scope.endDate = new Date();
    $scope.startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    $scope.interval = 'daily';
    console.log("chart controller")

    $scope.setInterval = function(interval){
        console.log(interval);
        $scope.interval = interval;
        refresh();
    }

    $scope.doRefresh = function(){
        refresh();
    }

    function getIntervalEnd(startDate){
        var endDate = startDate;

        switch ($scope.interval) {
            case 'weekly':
            endDate.setDate(endDate.getDate()+7)
            break;
            case 'monthly':
            endDate.setMonth(endDate.getMonth() +1);
            break;
            default:
            endDate.setDate(endDate.getDate()+1)

        }

        return endDate;
    }
    function refresh(){
        userService.getUsersPerInterval($scope.startDate, $scope.endDate, $scope.interval, function(data){

            var days=[];
            var values =[];

            var sum =0;

            var intervalSum = 0;
            var intervalStart = new Date($scope.startDate);
            var intervalEnd = getIntervalEnd(intervalStart);

            for(var x= 0; x< data.length; x++){
                var dayIntervalDay = new Date(data[x].day);
                if(dayIntervalDay >= intervalEnd ){

                    //days.push(new Date(data[x].day).toDateString());
                    //values.push(sum + data[x].count);
                    while(dayIntervalDay >= intervalEnd){

                        values.push(intervalSum);
                        days.push(intervalStart.toDateString());
                        intervalStart = intervalEnd;
                        intervalEnd = getIntervalEnd(intervalStart);
                        intervalSum = sum;
                    }

                }else if(x == data.length -1){
                    intervalSum += data[x].count
                    values.push(intervalSum);
                    days.push(intervalStart.toDateString());
                }


                intervalSum += data[x].count

                sum += data[x].count;

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
