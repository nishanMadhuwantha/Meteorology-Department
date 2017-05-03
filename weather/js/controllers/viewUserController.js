 (function () {
     'use strict';


     angular
        .module('app')
         .controller('viewUserController', viewUserController);

    viewUserController.$inject = ['$scope' , 'viewUserService' , '$state', '$http', '$filter', 'serverSettings'];
    function viewUserController($scope , viewUserService , $state ,$http, $filter, serverSettings) {
        var self = this;
        var webApi = serverSettings.webApi;
        viewUserService.userDetails.then(function (users) {
            $scope.users = users;
            console.log($scope.users);
        });

        $scope.remove = function(username) {
            $http.delete(webApi + '/remove/' + username).then(function (users) {
                $scope.users = users.data.users;
            });
        }
    }
 })();