angular
.module('app')
.config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider', '$breadcrumbProvider', function($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, $breadcrumbProvider) {
  $stateProvider
  .state('app.icons', {
    url: "/icons",
    abstract: true,
    template: '<ui-view></ui-view>',
    ncyBreadcrumb: {
      label: 'Icons'
    }
  })
  .state('app.icons.fontawesome', {
    url: '/font-awesome',
    templateUrl: 'views/icons/font-awesome.html',
    ncyBreadcrumb: {
      label: 'Font Awesome'
    }
  })
  .state('app.icons.simplelineicons', {
    url: '/simple-line-icons',
    templateUrl: 'views/icons/simple-line-icons.html',
    ncyBreadcrumb: {
      label: 'Simple Line Icons'
    }
  })
  .state('app.components', {
    url: "/components",
    abstract: true,
    template: '<ui-view></ui-view>',
    ncyBreadcrumb: {
      label: 'Components'
    }
  })
  .state('app.components.buttons', {
    url: '/buttons',
    templateUrl: 'views/components/buttons.html',
    ncyBreadcrumb: {
      label: 'Buttons'
    }
  })
  .state('app.components.social-buttons', {
    url: '/social-buttons',
    templateUrl: 'views/components/social-buttons.html',
    ncyBreadcrumb: {
      label: 'Social Buttons'
    }
  })
  .state('app.components.cards', {
    url: '/cards',
    templateUrl: 'views/components/cards.html',
    ncyBreadcrumb: {
      label: 'Cards'
    }
  })
  .state('app.components.forms', {
    url: '/forms',
    templateUrl: 'views/components/forms.html',
    ncyBreadcrumb: {
      label: 'Forms'
    }
  })
  .state('app.components.switches', {
    url: '/switches',
    templateUrl: 'views/components/switches.html',
    ncyBreadcrumb: {
      label: 'Switches'
    }
  })
  .state('app.components.tables', {
    url: '/tables',
    templateUrl: 'views/components/tables.html',
    ncyBreadcrumb: {
      label: 'Tables'
    }
      })
  .state('app.synopsis', {
    url: '/synopsis',
    templateUrl: 'views/pages/synopsis.html',
    controller : 'synopsisController',
    ncyBreadcrumb: {
      label: 'synopsis'
     
    }
  })
  .state('app.register', {
    url: '/register',
    templateUrl: 'views/pages/register.html',
    controller : 'registerController',
    ncyBreadcrumb: {
      label: 'register'
    }
  })
  .state('app.viewUser', {
    url: '/viewUser',
    templateUrl: 'views/pages/viewUser.html',
    controller : 'viewUserController',
    ncyBreadcrumb: {
      label: 'viewUser'
    }
  })
  .state('app.viewRecord', {
    url: '/viewRecord',
    templateUrl: 'views/pages/viewRecord.html',
    controller : 'viewRecordController',
    ncyBreadcrumb: {
      label: 'viewRecord'
    }
  })
   .state('app.map', {
    url: '/map',
    templateUrl: 'views/pages/map.html',
    controller:'mapController',
    ncyBreadcrumb: {
      label: 'map'
    }
  })
   .state('app.profile', {
    url: '/profile',
    templateUrl: 'views/users/profile.html',
    controller:'profileController',
    ncyBreadcrumb: {
      label: 'profile'
    }
  })
  .state('app.addWeatherS', {
    url: '/addWeatherS',
    templateUrl: 'views/pages/addWeatherS.html',
    controller: 'addWeatherSController',
    ncyBreadcrumb: {
      label: 'addWeatherStation'
    }
  })
  .state('app.charts', {
    url: '/charts',
    templateUrl: 'views/charts.html',
    ncyBreadcrumb: {
      label: 'Charts'
        
    },
    resolve: {
      // Plugins loaded before
      // loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad) {
      //     return $ocLazyLoad.load([
      //         {
      //             serial: true,
      //             files: ['js/libs/Chart.min.js', 'js/libs/angular-chart.min.js']
      //         }
      //     ]);
      // }],
      loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
        // you can lazy load files for an existing module
        return $ocLazyLoad.load({
          files: ['js/controllers/charts.js']
        });
      }]
    }
  })
}]);
