function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

function hasNumber(array, number)
{
  for (var i = 0; i < array.length; i++) {
    if (array[i].rider.number == number) 
    {
      console.log("HASNUMBER",array[i].number,number)
      return true;
    }
  };
  return false;
}

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
  
  });
  
    var seriesId = $stateParams.seriesId || window.localStorage.seriesId || "No Series Selected";
    if (seriesId == "No Series Selected")
      $location.path("/page/series");
    else
    {
      console.log("Search for Series",seriesId);
      Series.getSeries(seriesId,function(s){ 

        console.log("Got Series",s);
        $scope.series = s;
        $rootScope.currentRace = $scope.series.races[$scope.series.races.length-1];
        $rootScope.currentSeries = $scope.series;
        window.localStorage.seriesId = seriesId;

        $scope.refreshRoutes();
        console.log("Refreshed routes",$rootScope.currentRace);
      });
    } 
  
  

})
.controller('RouteCtrl', function($rootScope, $scope, $stateParams, Series, leafletData,$timeout) {
  $scope.refreshRoutes = function()
  {
    $scope.loaded = false;
    Series.getRoutes($scope.race,function(routes){
      Series.hide(); 
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
      },200);

    });
  }
  
  $scope.$on('$ionicView.enter', function(e) {
  
  });

    Series.show();
    var seriesId = $stateParams.seriesId;
    var raceId = $stateParams.raceId;
    if (debug) console.log(seriesId,raceId);
    Series.getSeries(seriesId,function(s){ 
      $scope.race = Series.getRace(s,raceId);
      $scope.refreshRoutes();
    });
})

.controller('RankCtrl', function($rootScope, $scope, $stateParams, $http, Series, $timeout) {

  $scope.$on('$ionicView.enter', function(e) {

  });

    Series.show();
    
    var seriesId = $stateParams.seriesId;
    var raceId = $stateParams.raceId;
    var routeId = $stateParams.routeId;

    $http.get(URL + "/route/ranks/" + routeId)
    .then(function(ranks){
      console.log(ranks);
      $scope.ranks = ranks.data;
      Series.hide();
    },function(err){
      Series.hide();
    });
      
})

.controller('FavCtrl', function($rootScope, $http, $scope, Series, $ionicPopup) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //

  var showAlert = function(n) {
   var alertPopup = $ionicPopup.alert({
     title: 'Not Found!',
     template: 'Rider #' + n + ' was not found.'
   });
   alertPopup.then(function(res) {

   });
  };

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
        Series.hide();
        showAlert(n);
      }
    },function(response){
      //error!!
      console.log(response);
      Series.hide();
    });
  };

  $scope.remove = function(f) {
    Series.show();
    $http.get(URL + "/device/" + $rootScope.deviceObj.id + "/follows/remove/" + f.id)
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
  };
})

.controller('FavDetailCtrl', function($rootScope, $scope, $stateParams, Series, $timeout, $http, leafletData) {
  var riderId = $stateParams.riderId;
  $scope.following = false;

   $scope.follow = function() {
    Series.show();
    $http.get(URL + "/device/" + $rootScope.deviceObj.id + "/follows/add/" + riderId)
    .then(function(response){
      console.log(response.data)
      $rootScope.deviceObj = response.data;
      $scope.following = true;
      Series.hide();
    },function(response){
      //error!!
      console.log(response);
      Series.hide();
    });
  };

  $scope.unfollow = function() {
    Series.show();
    $http.get(URL + "/device/" + $rootScope.deviceObj.id + "/follows/remove/" + riderId)
    .then(function(response){
      console.log(response.data)
      $rootScope.deviceObj = response.data;
      $scope.following = false;
      Series.hide();
    },function(response){
      //error!!
      console.log(response);
      Series.hide();
    });
  };

  $scope.getRouteRank = function(routeId)
  {
    if (riderId && routeId)
    {
      Series.show();
      $http.get(URL + "/route/rank/" + routeId + "?riderId=" + riderId)
      .then(function(response){
        if (response.data)
        {

          $scope.graph = response.data.graph;

          for (var i = 0; i < $rootScope.deviceObj.follows.length; i++) {
            if ($rootScope.deviceObj.follows[i].id == $scope.rider.id)
              $scope.following = true;
          };

          Series.hide();
        }
        else
        {
          Series.hide();
        }
      },function(response){
        //error!!
        console.log(response);
        Series.hide();
      });
    }
  }

  if (riderId)
  {
    Series.show();
    $http.get(URL + "/route/rank/?riderId=" + riderId)
    .then(function(response){
      if (response.data)
      {
        $scope.rider = response.data.rider;
        $scope.graph = response.data.graph;

        for (var i = 0; i < $rootScope.deviceObj.follows.length; i++) {
          if ($rootScope.deviceObj.follows[i].id == $scope.rider.id)
            $scope.following = true;
        };

        Series.hide();
      }
      else
      {
        Series.hide();
      }
    },function(response){
      //error!!
      console.log(response);
      Series.hide();
    });
  }

})

.controller('SettingsCtrl', function($rootScope, $scope, $ionicDeploy, $ionicPlatform) {
  $scope.settings = {
    enableFriends: true
  };

  $scope.clearCache = function()
  {
    delete window.localStorage.deviceObj;
  }

  $ionicPlatform.ready(function() {
  // Update app code with new release from Ionic Deploy
    $scope.doUpdate = function() {
      $scope.loading = true;
      $ionicDeploy.update().then(function(res) {
        console.log('Update Success! ', res);
        $scope.res = 'Update Success! ';
        $scope.loading = false;
      }, function(err) {
        console.log('Update error! ', err);
        $scope.res = 'Update error! ' + err;
        $scope.loading = false;
      }, function(prog) {
        console.log('Progress... ', prog);
        $scope.res = prog + "%";
      });
    };

    // Check Ionic Deploy for new code
    $scope.checkForUpdates = function() {
      $scope.loading = true;
      $scope.res = 'Checking for updates';
      console.log('Checking for updates');
      $ionicDeploy.check().then(function(hasUpdate) {
        console.log('Update available: ' + hasUpdate);
        $scope.res = 'Update available! ';
        $scope.loading = false;
        $scope.hasUpdate = hasUpdate;
      }, function(err) {
        console.error('Unable to check for updates', err);
        $scope.res = 'Update check error! ' + err;
        $scope.loading = false;
      });
    }
  });
})
