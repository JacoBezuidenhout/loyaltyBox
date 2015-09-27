module.exports = {

  attributes: {
  	number: {type: "string", required: true},
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
  }
};
