(function () {
    'use strict';


    angular
        .module('app')
        .controller('synopsisController', synopsisController);

    synopsisController.$inject = ['$scope' , 'synopsisService' , '$state'];

    function synopsisController($scope , synopsisService , $state) {
        
   
         
        $scope.submit = function () {
         synopsisService.submit($scope.user).then(function success(data) {
                if(data.status==201){
                $state.go('app.main');
             }else{
                 $state.go('app.synopsis');
                 window.alert("Invalid synopsis!");
             }
         });
        }
    }

})();
