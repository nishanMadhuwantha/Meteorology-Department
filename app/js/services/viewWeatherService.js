(function () {
    'use strict';

    angular
        .module('app')
        .factory('viewWeatherService', viewWeatherService);

    viewWeatherService.$inject = ['$http' , 'serverSettings','$filter'];

    function viewWeatherService($http , serverSettings, $filter) {
         var webApi = serverSettings.webApi ;

        return {
            weatherDetails: $http.get(webApi + '/weathers').then(function (weathers) {
                return (weathers.data.weathers);
            })
        };

    }
})();
