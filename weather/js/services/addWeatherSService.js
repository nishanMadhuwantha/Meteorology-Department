(function () {
    'use strict';

    angular
        .module('app')
        .factory('addWeatherSService', addWeatherSService);

    addWeatherSService.$inject = ['$http' , 'serverSettings'];

    function addWeatherSService($http , serverSettings) {


        var webApi = serverSettings.webApi ;

        var service = {
            create: create
        };

        return service;

        function create(user) {
            return $http({
                url: webApi + '/addweathers',
                method: "POST",
                data: user,
                headers: { 'Content-Type': 'application/json' }
            }).then(handleSuccess, handleError('Error create weather station'));
        }

        function handleSuccess(res) {
            return res;
        }

        function handleError(error) {
            return function () {
                return { success: false, message: error };
            };
        }



    }
})();
