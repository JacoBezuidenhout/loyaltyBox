angular.module('app.services', [])

.factory('Series', function($http, $ionicLoading) {
  // Might use a resource here that returns a JSON array
  // Some fake testing data
  var series = [];
  var seriesAge = 0;

  var ranks = [
    {rank: "1",name: "Me"},
    {rank: "2",name: "You"},
    {rank: "3",name: "Them"},
    {rank: "4",name: "Us"},
    {rank: "5",name: "Other"}
  ];

  return {
    show : function() {
      $ionicLoading.show({
        template: 'Loading...'
      });
    },
    hide : function(){
      $ionicLoading.hide();
    },
    all: function(cb) {
      var now = new Date().getTime();
      if (now - seriesAge > 10000)
      {
        console.log("Getting Series");
        $http.get(URL + "/series")
        .then(function(response){
          seriesAge = new Date().getTime();
          series = response.data;
          for (var i = 0; i < series.length; i++) {
            series[i].image = URL + "/images/series/" + series[i].image;
            console.dir(series[i]);
          };
          cb(series);
        },function(response){
          console.dir(response);
          cb(series);
          return;
        });
      }
      else 
      {
        console.log("Sending Series");
        cb(series);
        return;
      }
    },
    remove: function(s) {
      series.splice(series.indexOf(s), 1);
    },
    ranks: function(seriesId,routeId)
    {
      return ranks;
    },
    getRace: function(s,raceId)
    {
      for (var j = 0; j < s.races.length; j++)
      {
        if (s.races[j].id === raceId)
        {
          console.log("race found");
          return s.races[j];
        }
      }    
      return null;
    },
    getRoutes: function(race,cb)
    {
      $http.get(URL + "/route?race=" + race.id)
      .then(function(response){
        console.log("got routes");
        cb(response.data);
      },function(response){
        console.dir(response);
      });
    },
    getSeries: function(seriesId,cb) {
      for (var i = 0; i < series.length; i++) {
        if (series[i].id === seriesId) {
          cb(series[i]);
          return;
        }
      }
      cb(null);
    }
  };
});
