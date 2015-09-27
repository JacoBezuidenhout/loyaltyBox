/**
* Device.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	deviceInfo: {type: "json"},
  	password: {type: "string", defaultsTo: "1234"},
  	follows : {collection: "Rider", via: "followers"},  
  	toJSON: function() {
      var obj = this.toObject();
      delete obj.password;
      return obj;
    }
  }

};

