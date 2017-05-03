/**
 * Created by nilupul on 3/15/17.
 */
angular.module('PopupDemo').controller('PopupDemoCont', ['$scope','$modal',function ($scope, $modal) {
    $scope.open = function () {
        console.log('opening pop up');
        var modalInstance = $modal.open({
            templateUrl: 'views/popup.html',
            controller: 'PopupCont',
        });
    }
}]);