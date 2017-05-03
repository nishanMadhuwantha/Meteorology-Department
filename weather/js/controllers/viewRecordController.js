(function () {
    'use strict';


    angular
        .module('app')
        .controller('viewRecordController', viewRecordController);

    viewRecordController.$inject = ['$scope' , 'viewRecordService' , '$state', '$http', '$filter', 'serverSettings','$window'];
    function viewRecordController($scope , viewRecordService , $state ,$http, $filter, serverSettings, $window) {
        var self = this;
        var webApi = serverSettings.webApi;
        viewRecordService.recordDetails.then(function (records) {
            $scope.records = records;
            console.log($scope.records);
        });
        $scope.viewSynopsis = function(synopsis) {
            $http.get(webApi + '/synopsis/' + synopsis).then(function (record) {
                $scope.record = record.data.record;
                swal({
                    title: "Synopsis :",
                    text: $scope.record[0].synop,
                    confirmButtonText: "OK"
                });
            });
        }
        $scope.viewWeatherData = function (station) {
            $scope.weather;
            $http.get(webApi + '/weatherdata/' + station).then(function (record) {
                $scope.weather = record.data.weather;
                console.log($scope.weather);
                swal({
                    title: "weather :",
                    text: $scope.weather,
                    confirmButtonText: "OK"
                });
            });
        }
    }
})();