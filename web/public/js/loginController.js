hiredOrFired.controller('loginController', function( $scope,$location, $http , $rootScope) {

    $scope.login=function() {
     	var client_id= environmentService.getClientIdForEnvironment(); //"bfadf7a0-3364-4f65-9fda-00d37877113f";
     	var redirect_uri=window.location.origin + "/oauth2/callback";
     	var response_type="token";
     	var url= environmentService.signinUrl() + "/authorize?client_id="+client_id+"&redirect_uri="+redirect_uri+
     	"&response_type="+response_type;

        window.location.replace(url);
     };

     if($rootScope.access_token){
         $location.path('/browse');
     }

});
