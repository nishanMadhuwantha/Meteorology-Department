(function () {
    'use strict';


    angular
        .module('app')
        .controller('mapController', mapController);

   mapController.$inject = ['$scope' , '$state', '$http', '$filter', 'serverSettings','$window'];
    function mapController($scope , $state ,$http, $filter, serverSettings, $window) {
        var webApi = serverSettings.webApi;
        $http.get(webApi + '/weather').then(function (response) {
            var weather = response.data;
            console.log(response.data[0].temperature);
            $scope.marker =function(id) {
                $scope.weather = weather[id - 1];
            }
        });
    }

})();