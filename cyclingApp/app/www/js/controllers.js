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

.controller('DashCtrl', function($rootScope, $scope, $stateParams, $location, Series, leafletData, leafletBoundsHelpers) {

  legend = {};
  legend.position = 'bottomleft';

  angular.extend($scope, {
      defaults: {
          tileLayer: "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png",
          zoomControlPosition: 'topright',
          tileLayerOptions: {
              opacity: 0.9,
              detectRetina: true,
              reuseTiles: true,
          },
          scrollWheelZoom: false
      },
      bounds: {},
      routes: {},
      legend: {},
      center: {
        zoom: 13,
        "lng": 28.15844,
        "lat": -25.84625
      },
      checkpoints: [],
      layers: {}
  });

  $scope.refreshRoutes = function()
  {
    Series.show();
    Series.getRoutes($rootScope.currentRace,function(routes){
      $scope.$applyAsync(function(){
        legend.colors = [];
        legend.labels = [];
        $scope.routes = routes;
        var checkpoints = [];
        var bounds = [];
        for (var i = 0; i < routes.length; i++) {
          legend.labels.push(routes[i].title);
          legend.colors.push(routes[i].color);
          var allCoords = [];
          for (var j = 0; j < routes[i].checkpoints.length; j++) {
            checkpoints.push(routes[i].checkpoints[j]);
            bounds.push([routes[i].checkpoints[j].lat, routes[i].checkpoints[j].lng])
            if (debug) console.dir(routes[i].checkpoints[j]);
          };
        };
        $scope.legend = legend;
        $scope.checkpoints = checkpoints;
        leafletData.getMap("dashMap").then(function(map) {
          console.log("got map");
          map.invalidateSize();
          map.fitBounds(bounds);
          // map.fitWorld({maxZoom: 6});
          Series.hide();
        });
      });
    });
  }

  $scope.$on('$ionicView.enter', function(e) {
    var seriesId = $stateParams.seriesId || window.localStorage.seriesId || "No Series Selected";
    if (seriesId == "No Series Selected")
      $location.path("/page/series");
    else
    {
      Series.getSeries(seriesId,function(s){ 
        console.log("Got Series");
        $scope.series = s;
        $rootScope.currentRace = $scope.series.races[$scope.series.races.length-1];
        $rootScope.currentSeries = $scope.series;
        window.localStorage.seriesId = seriesId;

        $scope.refreshRoutes();
        console.log("Refreshed routes");
      });
    } 
  });
  
  

})
.controller('RouteCtrl', function($rootScope, $scope, $stateParams, Series, leafletData,$timeout) {
  $scope.$on('$ionicView.enter', function(e) {
    Series.show();
    var seriesId = $stateParams.seriesId;
    var raceId = $stateParams.raceId;
    if (debug) console.log(seriesId,raceId);
    Series.getSeries(seriesId,function(s){ 
      $scope.race = Series.getRace(s,raceId);
      Series.getRoutes($scope.race,function(routes){
        $scope.routes = routes;

        var bounds = [];
        for (var i = 0; i < routes.length; i++) {
          for (var j = 0; j < routes[i].checkpoints.length; j++) {
            bounds.push([routes[i].checkpoints[j].lat, routes[i].checkpoints[j].lng]);
          };
        };
        
        $timeout(function(){
          for (var i = 0; i < routes.length; i++) {
            leafletData.getMap(routes[i].id).then(function(map) {
              console.log("got map");
              map.fitBounds(bounds);
            });
          }
          $scope.loaded = true;
        },1000);

        Series.hide();
      });
    });
  });
})

.controller('RankCtrl', function($rootScope, $scope, $stateParams, Series, $timeout) {

  $scope.labels = ["A", "B", "C", "D", "E", "F", "G"];
  $scope.series = ["123: Jaco Bezuidenhout","456: John Dough","789: Xander Botha"];
  $scope.data = [
    [4, 4, 2, 1, 1, null, null],
    [2, 3, 6, 2, 2, null, null],
    [3, 2, 1, 5, 3, null, null]
  ];

  $scope.data2 = [
    [300, 224, 150, 50, 3, null, null]
  ];
  $scope.onClick = function (points, evt) {
    console.log(points, evt);
  };

  $scope.$on('$ionicView.enter', function(e) {
    Series.show();
    var seriesId = $stateParams.seriesId;
    var raceId = $stateParams.raceId;
    var routeId = $stateParams.routeId;

    Series.getRanks(seriesId,raceId,routeId, function(ranks){
      $scope.ranks = ranks;
      console.log(ranks);
      Series.hide();
    });

  });
})

.controller('FavCtrl', function($rootScope, $http, $scope, Series) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  $scope.$on('$ionicView.enter', function(e) {
    $scope.favourites = $rootScope.deviceObj.follows || [];
  });

  $scope.add = function(n) {
    Series.show();
    $http.get(URL + "/rider?number=" + n)
    .then(function(response){
      if (response.data.length)
      {
        $http.get(URL + "/device/" + $rootScope.deviceObj.id + "/follows/add/" + response.data[0].id)
        .then(function(response){
          console.log(response.data)
          $rootScope.deviceObj = response.data;
          $scope.favourites = $rootScope.deviceObj.follows || [];
          Series.hide();
        },function(response){
          //error!!
          console.log(response);
          Series.hide();
        });
      }
      else
      {
        alert("No Rider Found with that number.")
      }
    },function(response){
      //error!!
      console.log(response);
      Series.hide();
    });
  };

  $scope.remove = function(f) {

  };
})

.controller('FavDetailCtrl', function($rootScope, $scope, $stateParams, Series) {
  var riderId = $stateParams.riderId;
  
})

.controller('SettingsCtrl', function($rootScope, $scope) {
  $scope.settings = {
    enableFriends: true
  };
});
