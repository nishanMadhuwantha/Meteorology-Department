(function () {
    'use strict';

    angular
        .module('app')
        .factory('synopsisService', synopsisService);

    synopsisService.$inject = ['$http' , 'serverSettings'];

    function synopsisService($http , serverSettings) {


        var webApi = serverSettings.webApi ;

        var service = {
            submit: submit
        };

        return service;

        function submit(user) {
            return $http({
                url: webApi + '/synopsis',
                method: "POST",
                data: user,
                headers: { 'Content-Type': 'application/json' }
            }).then(handleSuccess, handleError('Error enter the synopsis'));
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
