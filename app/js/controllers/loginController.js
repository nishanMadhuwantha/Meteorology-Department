(function () {
    'use strict';


    angular
        .module('app')
        .controller('loginController', loginController);

    loginController.$inject = ['$scope' , 'loginService' , '$state','$window' , '$rootScope'];

    function loginController($scope , loginService , $state , $window , $rootScope) {
         
        $scope.login = function () {
         loginService.login($scope.user).then(function success(data) {
             if(data.status==200){
                 localStorage.setItem("user" , JSON.stringify(data.data.user));
                 $rootScope.user = data.data.user;
                 localStorage.setItem("role", data.data.user.role);
                 $rootScope.role = data.data.user.role;
                 $state.go('app.main');
             }else{
                 $state.go('app.login');
                 window.alert("Invalid username and password!");
             }
         });
        }
    }

})();