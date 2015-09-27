module.exports = {

  attributes: {
  	title: {type: "string", required: true},
  	order: {type: "string", required: true},
  	lng: {type: "float", required: true},
    lat: {type: "float", required: true},
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
  }
};