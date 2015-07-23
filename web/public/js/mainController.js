hiredOrFired.controller('mainController', function($scope, $rootScope, userService){
    console.log('main controller load')
    $scope.view = 'calendar';

    $scope.setView = function(view){
        console.log('set view ' + view)
        $scope.view = view;

        $rootScope.$broadcast('ViewChanged', view);
    }
});
