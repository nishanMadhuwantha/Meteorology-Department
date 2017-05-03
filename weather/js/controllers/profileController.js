 (function () {
     'use strict';


     angular
        .module('app')
         .controller('profileController', profileController);

    profileController.$inject = ['$scope' , 'profileService' , '$state', '$http', '$filter', 'serverSettings', '$window', '$rootScope'];
    function profileController($scope , profileService , $state ,$http, $filter, serverSettings, $window, $rootScope) {
        var webApi = serverSettings.webApi;
        profileService.userDetails.then(function (user) {
            $scope.user = user;
            console.log($scope.user);
        });

        $scope.edit = function(user) {
            console.log(user);
            $http({
                url: webApi + '/updateuser',
                method: "POST",
                data: user,
                headers: {'Content-Type': 'application/json'}
            }).then(function (response) {
                if(response.status = 200) {
                    var newUser = {
                        "fname": user.fname,
                        "username": user.username,
                        "role": user.role
                    }
                    localStorage.setItem("user", JSON.stringify(newUser));
                    $rootScope.user = newUser;
                    console.log(localStorage.getItem("user"));
                } else {
                    swal({
                        type: "error",
                        title: "Error!",
                        text: "User update fail",
                        confirmButtonText: "OK"
                    });
                }
            });
        }
    }
 })();