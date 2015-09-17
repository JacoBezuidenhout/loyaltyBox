module.exports = {

  attributes: {
  	checkpoint: {model: "Checkpoint", via: "updates"},
  	rider: {model: "Rider", via: "updates"}
  }

};