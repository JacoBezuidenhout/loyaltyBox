module.exports = {

  attributes: {
  	checkpoint: {model: "Checkpoint", via: "updates", required: true},
  	rider: {model: "Rider", via: "updates", required: true},
    date: {type: "dateTime"},
  	updateString: {type: "string", required: true}
  },
  afterCreate: function(u,cb)
  {
  	Rider.findOne({id:u.rider}).exec(function afterwards(err, rider){
      Checkpoint.findOne({id:u.checkpoint}).exec(function afterwards(err, checkpoint){
        // Route.findOne({id:checkpoint.route}).exec(function afterwards(err, route){
   
          checkpoint.lastUpdate = u.updateString;
          checkpoint.save();
          
          rider.lastUpdate = u.updateString;
          rider.save();

  	  		cb();
        // });
		  });
  	});
  }

};