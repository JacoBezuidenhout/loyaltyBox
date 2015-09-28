/**
* Route.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	title:  {type: "string", required: true},
    message: {type: "string", defaultsTo: "Route"},
  	color: {type: "string", required: true},
    weight: {type: "string", defaultsTo: "5"},
    opacity: {type: "string", defaultsTo: "0.6"},
	dateStart:  {type: "dateTime", required: true},
	dateEnd:  {type: "dateTime", required: true},
  	race: {model: "Race", via: "routes"},
  	checkpoints: {collection: "Checkpoint", via: "route"},
  	riders: {collection: "Rider", via: "routes"}
  },
  beforeCreate: function(values,next)
  {
  	values.latlngs = JSON.parse(values.latlngs);
  	next();
  }

  
};

