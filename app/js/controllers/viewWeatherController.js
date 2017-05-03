(function () {
     'use strict';


     angular
        .module('app')
         .controller('viewWeatherController', viewWeatherController);

    viewWeatherController.$inject = ['$scope' , 'viewWeatherService' , '$state', '$http', '$filter', 'serverSettings'];
    function viewWeatherController($scope , viewWeatherService , $state ,$http, $filter, serverSettings) {
        var self = this;
        var webApi = serverSettings.webApi;
        viewWeatherService.weatherDetails.then(function (weathers) {
            $scope.weathers = weathers;
            console.log($scope.weathers);
        })
    }
 })();