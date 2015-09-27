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

var mock = {
  routes: [
    {
        "checkpoints": [          
          {
            lat: 51.505,
            lng: -0.09,
            draggable: false,
            message: "Hi there!",
            icon: {}
          },
          {
            lat: 51.505,
            lng: -0.19,
            draggable: false,
            message: "Hi there!",
            icon: {}
          }
          ],
        "race": {
          "title": "7 Dullstroom",
          "location": "Dullstroom",
          "province": "Mpumalanga",
          "date": "13/09/2015",
          "day": "Sun",
          "series": "55f9bfb4c608b0341d14eb68",
          "createdAt": "2015-09-16T21:00:50.409Z",
          "updatedAt": "2015-09-16T21:00:50.409Z",
          "id": "55f9d88231ea5f3829603d39"
        },
        "createdAt": "2015-09-16T23:03:20.334Z",
        "updatedAt": "2015-09-16T23:26:40.467Z",
        "title": "Route 1",
        "id": "55f9f53831ea5f3829603d3a",
        color: 'red',
        weight: 8,
        latlngs: [
            { lat: 51.50, lng: -0.082 },
            { lat: 48.83, lng: 2.37 },
            { lat: 41.91, lng: 12.48 }
        ],
        message: "<h3>Route from London to Rome</h3><p>Distance: 1862km</p>",
    },
    {
        "checkpoints": [],
        "race": {
          "title": "7 Dullstroom",
          "location": "Dullstroom",
          "province": "Mpumalanga",
          "date": "13/09/2015",
          "day": "Sun",
          "series": "55f9bfb4c608b0341d14eb68",
          "createdAt": "2015-09-16T21:00:50.409Z",
          "updatedAt": "2015-09-16T21:00:50.409Z",
          "id": "55f9d88231ea5f3829603d39"
        },
        "createdAt": "2015-09-16T23:03:20.334Z",
        "updatedAt": "2015-09-16T23:26:40.467Z",
        "title": "Route 2",
        "id": "55f9f53831ea5f3829603d3a",
        color: 'green',
        weight: 8,
        latlngs: [
            { lat: 48.2083537, lng: 16.3725042 },
            { lat: 48.8534, lng: 2.3485 }
        ],
        label: {message: "<h3>Route from Vienna to Paris</h3><p>Distance: 1211km</p>"}
    }
  ]
}

  var FUNCTIONS = {
    show : function() {
      $ionicLoading.show({
        template: '<ion-spinner icon="lines" class="spinner-energized"></ion-spinner><br/>Loading...',
        noBackdrop: true,
        duration: 5000
      });
    },
    hide : function(){
      $ionicLoading.hide();
    },
    refreshSeries: function(cb)
    {
      $http.get(URL + "/series")
      .then(
        function(response){
          series = response.data;
          for (var i = 0; i < series.length; i++) {
            series[i].image = URL + "/images/series/" + series[i].image;
            series[i].logo = URL + "/images/logo/" + series[i].logo;
          };
          cb();
        },function(response){
          if (debug) console.dir(response);
          //error!!
          cb();
          return;
        }
      );
    },
    all: function(cb) {
      var now = new Date().getTime();
      if (now - seriesAge > 10000)
      {
        if (debug) console.log("Getting Series");
        seriesAge = new Date().getTime();
        FUNCTIONS.refreshSeries(function(){
          cb(series);
        });
      }
      else 
      {
        if (debug) console.log("Sending Series");
        cb(series);
        return;
      }
    },
    getSeries: function(seriesId,cb) {
      for (var i = 0; i < series.length; i++) {
        if (series[i].id === seriesId) {
          cb(series[i]);
          return;
        }
      }
      cb(null);
    },
    getRace: function(s,raceId)
    {
      for (var j = 0; j < s.races.length; j++)
      {
        if (s.races[j].id === raceId)
        {
          if (debug) console.log("race found");
          return s.races[j];
        }
      }    
      return null;
    },
    getRoutes: function(race,cb)
    {
      $http.get(URL + "/route?race=" + race.id)
      .then(function(response){
        console.dir(response);
        if (debug) console.log("got routes");
        if (response.data.length)
          cb(response.data);
        else
          cb(null);
        return;
      },function(response){
        if (debug) console.dir(response);
        cb(null);
        return;
      });
    },
    getRanks: function(seriesId,raceId,routeId,cb)
    {
      cb([
        {pos: 1, name: "Jaco", surname: "Bez", lastCheckpoint: "C", dateTime: new Date()},
        {pos: 3, name: "Xander", surname: "Botha", lastCheckpoint: "A", dateTime: new Date()},
        {pos: 2, name: "Pieter", surname: "Bezuidenhouit", lastCheckpoint: "B", dateTime: new Date()}
      ]);
    },
  };
  
return FUNCTIONS;
});

