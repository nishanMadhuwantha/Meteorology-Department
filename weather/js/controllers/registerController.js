(function () {
    'use strict';


    angular
        .module('app')
        .controller('registerController', registerController);

    registerController.$inject = ['$scope' , 'registerService' , '$state','$window'];

    function registerController($scope , registerService , $state) {
         
        $scope.register = function () {
         registerService.register($scope.user).then(function success(data) {
            if(data.status==201){
                $state.go('app.main');
             }else{
                 $state.go('app.login');
                swal({
                    type: "error",
                    title: "Error!",
                    text: "Invalid registration",
                    confirmButtonText: "OK"
                });
             }
         });
        }
    }

})();


