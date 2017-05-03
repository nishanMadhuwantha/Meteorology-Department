 (function () {
     'use strict';


     angular
        .module('app')
         .controller('profileController', profileController);

    profileController.$inject = ['$scope' , 'profileService' , '$state', '$http', '$filter', 'serverSettings'];
    function profileController($scope , profileService , $state ,$http, $filter, serverSettings) {
        var self = this;
        var webApi = serverSettings.webApi;
        profileService.userDetails.then(function (user) {
            $scope.user = user;
            console.log($scope.user);
        });

        $scope.edit = function(username) {
            $http.post(webApi + '/remove/' + nic).then(function (user) {
                $scope.user = user.data.user;
            });
        }
    }
 })();