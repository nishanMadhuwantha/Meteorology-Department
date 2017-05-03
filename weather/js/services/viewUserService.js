(function () {
    'use strict';

    angular
        .module('app')
        .factory('viewUserService', viewUserService);

    viewUserService.$inject = ['$http' , 'serverSettings','$filter'];

    function viewUserService($http , serverSettings, $filter) {
         var webApi = serverSettings.webApi ;

        return {
            userDetails: $http.get(webApi + '/users').then(function (users) {
                return (users.data.users);
            }),
            removeUser: function(username) {

            }
        };

    }
})();
