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
                 console.log(data.data.user);
                 localStorage.setItem("user" , JSON.stringify(data.data.user));
                 localStorage.setItem("username", data.data.user.username);
                 $rootScope.user = data.data.user;
                 localStorage.setItem("role", data.data.user.role);
                 $rootScope.role = data.data.user.role;
                 $state.go('app.main');
             }else{
                 $state.go('app.login');
                 swal({
                     type: "error",
                     title: "Error!",
                     text: "Invalid username or password",
                     confirmButtonText: "OK"
                 });
             }
         });
        }
    }

})();