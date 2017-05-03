(function () {
    'use strict';


    angular
        .module('app')
        .controller('registerController', registerController);

    registerController.$inject = ['$scope' , 'registerService' , '$state','$window'];

    function registerController($scope , registerService , $state) {
         
        $scope.register = function () {
         registerService.register($scope.user).then(function success(data) {
            if(data.status==200){
                $state.go('app.main');
             }else{
                 $state.go('app.login');
                window.alert("Invalid register!");
             }
         });
        }
    }

})();


