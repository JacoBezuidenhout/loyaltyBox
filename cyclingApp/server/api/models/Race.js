module.exports = {

  attributes: {
  	series: {model: "Series", via: "races"},
  	routes: {collection: "Route", via: "race"}
  }
};