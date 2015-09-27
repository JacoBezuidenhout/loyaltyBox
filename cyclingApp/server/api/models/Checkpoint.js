module.exports = {

  attributes: {
  	route: {model: "Route", via: "checkpoints"},
  	updates: {collection: "Update", via: "checkpoint"},
  	lastUpdate: {type: "string", defaultsTo: "No Updates Yet"}
  }
};