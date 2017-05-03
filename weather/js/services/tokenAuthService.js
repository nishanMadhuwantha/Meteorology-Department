/**
 * Created by nilupul on 3/11/17.
 */
(function () {
    'use strict';

    angular
        .module('app')
        .factory('tokenAuthService', tokenAuthService);

    tokenAuthService.$inject = ['$http' , 'serverSettings'];

    function tokenAuthService($http , serverSettings) {


        var webApi = serverSettings.webApi ;

        var service = {
            tokenAuth: tokenAuth
        };

        return service;

        function tokenAuth(token) {
            return $http({
                url: webApi + '/checktoken',
                method: "POST",
                data: {"token":token},
                headers: { 'Content-Type': 'application/json' }
            }).then(handleSuccess, handleError);
        }

        function handleSuccess(res) {
            return res.status;
        }

        function handleError() {
            return function () {
                return 404;
            };
        }



    }
})();
