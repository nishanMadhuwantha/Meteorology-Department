(function () {
    'use strict';

    angular
        .module('app')
        .factory('profileService', profileService);

    profileService.$inject = ['$http' , 'serverSettings','$filter'];

    function profileService($http , serverSettings, $filter) {
         var webApi = serverSettings.webApi ;

        return {
            userDetails: $http.get(webApi + '/user/' + localStorage.getItem("user").username).then(function (user) {
                return (user.data.user);
            }),
            editUser: function(nic) {

            }
        };

    }
})();
