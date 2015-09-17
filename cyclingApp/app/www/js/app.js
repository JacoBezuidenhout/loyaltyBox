var URL = "http://cycling.peoplesoft.co.za";
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('app', ['ionic', 'app.controllers', 'app.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
  // setup an abstract state for the tabs directive
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })
  .state('page', {
    url: '/page',
    abstract: true,
    templateUrl: 'templates/page.html'
  })
  // Each tab has its own nav history stack:

  .state('page.series', {
    url: '/series',
    views: {
      'page-series': {
        templateUrl: 'templates/page-series.html',
        controller: 'SeriesCtrl'
      }
    }
  })
  .state('tab.route', {
    url: '/dash/current',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-route.html',
        controller: 'RouteCtrl'
      }
    }
  })
  .state('tab.dash', {
    url: '/dash/:seriesId',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })
  .state('tab.rank', {
    url: '/dash/:seriesId/:raceId',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-rank.html',
        controller: 'RankCtrl'
      }
    }
  })

  .state('tab.fav', {
    url: '/fav',
    views: {
      'tab-fav': {
        templateUrl: 'templates/tab-fav.html',
        controller: 'FavCtrl'
      }
    }
  })
  .state('tab.fav-detail', {
    url: '/fav/:riderId',
    views: {
      'tab-fav': {
        templateUrl: 'templates/fav-detail.html',
        controller: 'FavDetailCtrl'
      }
    }
  })

  .state('tab.settings', {
    url: '/settings',
    views: {
      'tab-settings': {
        templateUrl: 'templates/tab-settings.html',
        controller: 'SettingsCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/page/series');

});
