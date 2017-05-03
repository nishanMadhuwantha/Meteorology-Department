(function () {
    'use strict';


    angular
        .module('app')
        .controller('synopsisController', synopsisController);

    synopsisController.$inject = ['$scope' , 'synopsisService' , '$state'];

    function synopsisController($scope , synopsisService , $state) {
        
   
         
        $scope.submit = function () {
            $scope.user.username = localStorage.getItem("username");
            synopsisService.submit($scope.user).then(function success(data) {
                if(data.status==201){
                    $state.go('app.main');
                }else{
                    $state.go('app.synopsis');
                    swal({
                        type: "error",
                        title: "Error!",
                        text: "Invalid synopsis",
                        confirmButtonText: "OK"
                    });
                }
            });
        }
    }

})();
