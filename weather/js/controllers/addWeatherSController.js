(function () {
    'use strict';


    angular
        .module('app')
        .controller('addWeatherSController', addWeatherSController);

    addWeatherSController.$inject = ['$scope' , 'addWeatherSService' , '$state'];

    function addWeatherSController($scope , addWeatherSService , $state) {
        
   
         
        $scope.create = function () {
         addWeatherSService.create($scope.user).then(function success(data) {
                if(data.status==201){
                $state.go('app.main');
             }else{
                 $state.go('app.addWeatherS');
                    swal({
                        type: "error",
                        title: "Error!",
                        text: "Weather station registration fail!",
                        confirmButtonText: "OK"
                    });
             }
         });
        }
    }

})();
