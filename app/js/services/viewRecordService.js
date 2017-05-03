(function () {
    'use strict';

    angular
        .module('app')
        .factory('viewRecordService', viewRecordService);

    viewRecordService.$inject = ['$http' , 'serverSettings','$filter'];

    function viewRecordService($http , serverSettings, $filter) {
        var webApi = serverSettings.webApi ;

        return {
            recordDetails: $http.get(webApi + '/records').then(function (records) {
                return (records.data.records);
            })
        };

    }
})();
