var hiredOrFired = angular.module('hiredOrFired',['ui.calendar', 'ui.bootstrap', 'chart.js']);

hiredOrFired.run(['$rootScope', '$injector', function($rootScope,$injector) {
    $injector.get("$http").defaults.transformRequest = function(data, headersGetter) {
        if ($rootScope.access_token){
            headersGetter()['Authorization'] = "Bearer "+$rootScope.access_token;
        }
        if (data)
        {
            return angular.toJson(data);
        }
    };
}]);
