var request = require('request');
var locations = require('./mockLocations');
var provinces = require('./mockProvinces');
var latlngsA = require("./mockLatlngsA");
var latlngsB = require("./mockLatlngsB");
var latlngsC = require("./mockLatlngsC");
var people = require("./people");
var checkpoints = require('./mockCheckpoints');
var titles = require('./mockTitles');
var days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

var URL = "http://cycling.peoplesoft.co.za";
URL = "http://localhost:1340";

var getLatLngs = function(j)
{
	console.log(latlngsA);
	if (j == 0) return JSON.stringify(latlngsA);
	if (j == 1) return JSON.stringify(latlngsB);
	if (j == 2) return JSON.stringify(latlngsC);
}

var r = function(n)
{
	return Math.floor(Math.random() * n);
}

var start = new Date(2010, 0, 1);

function randomDate(end) {
	start = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())); 
    return start;
}

var createSeries = function(cb)
{
	/*
	  	title: {type: "string", required: true},
	  	desc: {type: "string", required: true},
	  	image: {type: "string", required: true},
	  	logo: {type: "string", required: true},
	  	races: {collection: "Race", via: "series"},
	  	riders: {collection: "Rider", via: "series"}
	*/

	var obj = 
	{
		title : "My Awesome Series",
		desc : "This is a Simulated Series",
		image : "simulated.png",
		logo : "xrobotix.png",
		races : [],
		riders : []
	}

	request.post(URL + '/series/create', {form: obj}, function(err,httpResponse,body){ 
		cb(JSON.parse(body));
	})


}



var createRace = function(series,cb)
{
	/*
		title:  {type: "string", required: true},
		location:  {type: "string", required: true},
		province:  {type: "string", required: true},
		day:  {type: "string", required: true},
		dateStart:  {type: "date", required: true},
		dateEnd:  {type: "date", required: true},
	  	series: {model: "Series", via: "races"},
	  	routes: {collection: "Route", via: "race"},
	  	riders: {collection: "Rider", via: "races"}
	*/

	var obj =
	{
		title: titles[r(titles.length)].title,
		location: locations[r(locations.length)].location,
		province: provinces[r(provinces.length)].province,
		day: days[r(days.length)],
		dateStart: randomDate(new Date()),
		dateEnd: randomDate(new Date()),
		series: series.id
	}

	request.post(URL + '/race/create', {form: obj}, function(err,httpResponse,body){ 
		cb(JSON.parse(body));
	})
}

var createRoutes = function(race, i, cb)
{
	/*
	  	title:  {type: "string", required: true},
	    message: {type: "string", defaultsTo: "Route"},
	  	color: {type: "string", required: true},
	    weight: {type: "number", defaultsTo: 5},
	    opacity: {type: "double", defaultsTo: 0.6},
	    latlngs: {type: "json", defaultsTo: []},
		dateStart:  {type: "dateTime", required: true},
		dateEnd:  {type: "dateTime", required: true},
	  	race: {model: "Race", via: "routes"},
	  	checkpoints: {collection: "Checkpoint", via: "route"},
	  	riders: {collection: "Rider", via: "routes"}
	*/

	var obj = 
	{
		title: ["Hard","Medium","Beginner"][i],
		message: ["80km","50km","10km"][i],
		color: ["red","green","blue"][i],
		latlngs: getLatLngs(i),
		dateStart: race.dateStart,
		dateEnd: race.dateEnd,
		race: race.id
	}

	request.post(URL + '/route/create', {form: obj}, function(err,httpResponse,body){ 
		createCheckpoints(JSON.parse(body),i,function(cp){
			cb(cp);
		});
	})
}


var createCheckpoints = function(route, j, cb)
{
	/*
	  	title: {type: "string", required: true},
	  	lng: {type: "string", required: true},
	    lat: {type: "string", required: true},
	    message: {type: "string", required: true},
	    draggable: {type: "boolean", defaultsTo: false},
	    icon: {
	    	type: "json", 
	    	defaultsTo: {

	    		"type": "awesomeMarker",
	          	"icon": "flag",
	          	"markerColor": "red"
	        }
	    },    
	  	route: {model: "Route", via: "checkpoints"},
	  	updates: {collection: "Update", via: "checkpoint"},
	  	lastUpdate: {type: "string", defaultsTo: "No Updates Yet"}
	*/
	for (var i = 0; i < checkpoints[j].length; i++) {
		var obj = 
		{
			title: route.title + " " + j + "-" + checkpoints[j][i].properties.order,
			order: checkpoints[j][i].properties.order,
			lng: checkpoints[j][i].geometry.coordinates[0],
			lat: checkpoints[j][i].geometry.coordinates[1],
			message: route.title + " " + j + "-" + checkpoints[j][i].properties.order,
			route: route.id
		}
		request.post(URL + '/checkpoint/create', {form: obj}, function(err,httpResponse,body){ 
			console.log(body);
		});
	};

	cb(obj);
}

var createRider = function(cb)
{
	/*
	  	number: {type: "number", required: true},
	  	name: {type: "string", defaultsTo: "John"},
	  	club: {type: "string", defaultsTo: ""},
	  	sponsor: {type: "string", defaultsTo: ""},
	  	surname: {type: "string", defaultsTo: "Dough"},
	  	updates: {collection: "Update", via: "rider"},
	  	routes: {collection: "Route", via: "riders"},
	  	races: {collection: "Race", via: "riders"},
	  	series: {collection: "Series", via: "riders"},
	  	followers: {collection: "Device", via: "follows"},
	  	lastUpdate: {type: "string", defaultsTo: "No Updates Yet"}
	*/
	var obj = 
	{
		number: people[r(people.length)].number.toString(),
		name: people[r(people.length)].name,
		surname: people[r(people.length)].surname,
		club: "",
		sponsor: ""
	};

	request.post(URL + '/rider/create', {form: obj}, function(err,httpResponse,body){ 
		cb(JSON.parse(body));
	});
}

var createData = function(raceCount,routeCount)
{
	createSeries(function(series)
	{
		for (var i = 0; i < raceCount; i++) 
		{
			createRace(series,function(race){
				for (var j = 0; j < routeCount; j++) 
				{
					createRoutes(race,j,function(route){
						console.log(route);
					});
				}
			})
		};
	});
}

var registerRider = function(rider,route,cb)
{
	if (rider.id)
	{
		request.get(URL + '/rider/' + rider.id + '/routes/add/' + route.id, function(err,httpResponse,body){ 
			console.log("REGISTER");
			cb(JSON.parse(body));
		});
	}
	else
	{
		createRider(function(r){
			console.log(r,route);
			request.get(URL + '/rider/' + r.id + '/routes/add/' + route.id, function(err,httpResponse,body){ 
				console.log("NEW REGISTER");
				cb(JSON.parse(body));
			});
		});
	}
}

function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

var delayTime = Math.floor(Math.random()*10000)+1000;

var simulate = function(i)
{
	request.get(URL + '/route', function(err,httpResponse,body){ 
		// console.log(body);
		var route = JSON.parse(body)[i%3];
		registerRider({},route,function(r){
			var timeout = 0;
			console.log(route.checkpoints);
			route.checkpoints = sortByKey(route.checkpoints,"order");

			var i = 0;

		    var cpTimeout = setInterval(function(){
			    if (i < route.checkpoints.length-2)
			    {
				    var cp = JSON.parse(JSON.stringify(route.checkpoints[i]));
		            setTimeout(function(){	
			            var obj = 
			            {
			            	checkpoint: cp.id,
			            	rider: r.id,
			            	date: new Date(),
			            	updateString: (new Date().getTime()) + ": " + r.name + " passed " + cp.title
			            }
			            request.post(URL + '/update/create', {form: obj}, function(err,httpResponse,body){ 
							console.log(JSON.parse(body));
						});
		            },Math.floor(Math.random()*delayTime/2));
		        }
		        else
		        {
		        	clearTimeout(cpTimeout);
		        }
		      i++;
		    }, delayTime);
		});
	});

}


createData(1,3);
setTimeout(function(){
	for (var i = 0; i < 100; i++) {
		simulate(i);
	};
},5000);



