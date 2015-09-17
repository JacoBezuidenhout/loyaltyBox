/**
* Route.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	race: {model: "Race", via: "routes"},
  	checkpoints: {collection: "Checkpoint", via: "route"}
  }
  
};

