angular.module('app.controllers', [])

.controller('SeriesCtrl', function($rootScope, $ionicSlideBoxDelegate, $scope, $stateParams, $location, Series) {
  $scope.$on('$ionicView.enter', function(e) {
    window.localStorage.seriesId = "No Series Selected";
    Series.show();
    Series.all(function(series){
      $scope.$applyAsync(function()
      {
        $scope.series = series;
        $ionicSlideBoxDelegate.update();
        Series.hide();
      });
    });
  });

  $scope.enterSeries = function()
  {
    Series.show();
    var id = $ionicSlideBoxDelegate.currentIndex();
    $location.path("/tab/dash/" + $scope.series[id].id);
  }
})

.controller('DashCtrl', function($rootScope, $scope, $stateParams, $location, Series) {
  $scope.$on('$ionicView.enter', function(e) {
    var seriesId = $stateParams.seriesId || window.localStorage.seriesId || "No Series Selected";
    if (seriesId == "No Series Selected")
      $location.path("/page/series");
    else
    {
      Series.getSeries(seriesId,function(s){ 
        $scope.series = s;
        $rootScope.currentRace = $scope.series.races[$scope.series.races.length-1];
        $rootScope.currentSeries = $scope.series;
        window.localStorage.seriesId = seriesId;
        Series.hide();
      });
    } 
  });
})
.controller('RouteCtrl', function($rootScope, $scope, $stateParams, Series) {
  $scope.$on('$ionicView.enter', function(e) {
    Series.show();
    Series.getRoutes($rootScope.currentRace,function(routes){
      $scope.routes = routes;
      Series.hide();
    });
  });
})
.controller('RankCtrl', function($rootScope, $scope, $stateParams, Series) {
  $scope.$on('$ionicView.enter', function(e) {
    var seriesId = $stateParams.seriesId;
    var raceId = $stateParams.raceId;
    $scope.race = Series.getRace(Series.get(seriesId),raceId);
    // $scope.ranks = Series.ranks(seriesId,routeId);
  });
})

.controller('FavCtrl', function($rootScope, $scope, Series) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.favourites = Series.all();
  $scope.remove = function(f) {
    Series.remove(f);
  };
})

.controller('FavDetailCtrl', function($rootScope, $scope, $stateParams, Series) {
  var riderId = $stateParams.riderId;
  $scope.fav = Series.get(riderId);
})

.controller('SettingsCtrl', function($rootScope, $scope) {
  $scope.settings = {
    enableFriends: true
  };
});
