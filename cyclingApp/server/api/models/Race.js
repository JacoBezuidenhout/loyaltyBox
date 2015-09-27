module.exports = {

  attributes: {
	title:  {type: "string", required: true},
	location:  {type: "string", required: true},
	province:  {type: "string", required: true},
	day:  {type: "string", required: true},
	dateStart:  {type: "date", required: true},
	dateEnd:  {type: "date", required: true},
  	series: {model: "Series", via: "races"},
  	routes: {collection: "Route", via: "race"},
  	riders: {collection: "Rider", via: "races"}
  }
};
