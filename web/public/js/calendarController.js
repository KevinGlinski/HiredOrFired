hiredOrFired.constant('uiCalendarConfig', {calendars: {}})
hiredOrFired.controller('CalendarController', function($scope, $rootScope, $compile, $timeout, uiCalendarConfig, userService){

    var addedColor = "#2E8B57";
    var removedColor = "red";
    /*
    var date = new Date();
    var d = 1;
    var m = 7;
    var y = date.getFullYear();
*/
    $scope.events = [

    ];

    $scope.lastData = [];
    $scope.eventsF = function (start, end, timezone, callback) {
        var events=[];
        var s = new Date(start).getTime() / 1000;
        var e = new Date(end).getTime() / 1000;
        var m = new Date(start).getMonth();

        userService.getUsersForMonth(new Date(start).getFullYear(),new Date(start).getMonth() , function(users){
            console.log(users)

            var dateCount = {};

            for(var x = 0; x< users.length; x++){
                //console.log("adding " + users[x].name + " " + users[x].added )

                var color = addedColor;

                events.push({
                    title: users[x].name,
                    start: users[x].added,
                    color:  addedColor,
                    department: users[x].department,
                    role: users[x].title,
                })

                //HACK for demo, REMOVE SECOND PART OF IF CLAUSE
                if(users[x].removed && new Date(users[x].removed).getDate() != 23){
                    events.push({
                        title: users[x].name,
                        start: users[x].removed,
                        color: removedColor,
                        department: users[x].department,
                        role: users[x].title,
                    })

                }

            }
            $scope.lastData = events;

            callback(events);
        })


    };


    /* config object */
    $scope.uiConfig = {
        calendar:{
            editable: false,
            header:{
                left: '',
                center: 'title',
                right: 'today prev,next'
            },
            eventClick: $scope.alertOnEventClick,
            eventRender: function( event, element, view ) {
                element.attr({'tooltip': event.title +', ' + event.role + ', ' + event.department,
                'tooltip-append-to-body': true});
                $compile(element)($scope);
            }
        }
    };

    /* event sources array*/
    $scope.eventSources = [$scope.eventsF];
});
