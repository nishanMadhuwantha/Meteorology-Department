/**
 * Created by nilupul on 3/11/17.
 */
(function () {
    'use strict';


    angular
        .module('app')
        .controller('tokenAuthController', tokenAuthController);

    tokenAuthController.$inject = ['$scope' , 'loginService' , '$state','$window' , '$rootScope'];

    function tokenAuthController($scope , loginService , $state , $window , $rootScope) {

        $scope.login = function () {
            loginService.login($scope.user).then(function success(data) {
                if(data.status==200){
                    localStorage.setItem("user" , JSON.stringify(data.data.user));
                    $rootScope.user = data.data.user;

                    $state.go('app.main');
                }else{
                    $state.go('app.login');
                    window.alert("Invalid username and password!");
                }
            });
        }
    }

})();