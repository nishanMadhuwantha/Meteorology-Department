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
                 window.alert("Error create weather station!");
             }
         });
        }
    }

})();
