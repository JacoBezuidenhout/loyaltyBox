module.exports = {

  attributes: {
  	number: {type: "number", required: true},
  	name: {type: "string", defaultsTo: "John"},
  	surname: {type: "string", defaultsTo: "Dough"},
	updates: {collection: "Update", via: "rider"},
	followers: {collection: "Device", via: "follows"},
	lastUpdate: {type: "string", defaultsTo: "No Updates Yet"}
  }
};
