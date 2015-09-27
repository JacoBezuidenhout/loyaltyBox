module.exports = {

  attributes: {
  	checkpoint: {model: "Checkpoint", via: "updates", required: true},
  	rider: {model: "Rider", via: "updates", required: true},
  	updateString: {type: "string", required: true}
  },
  afterCreate: function(u,cb)
  {
  	Rider.update({id:u.rider},{lastUpdate: u.updateString}).exec(function afterwards(err, updated){
  	  Checkpoint.findOne({id:u.checkpoint}).exec(function afterwards(err, record){
  			console.log("RIDER",updated);
	  		console.log("CHECKPOINT",record);
	  		record.updateString = (updated[0].number || "No Number") + " passed " + record.title;
	  		record.icon.markerColor = "green";
        record.save();
	  		console.log("CHECKPOINT",record);
	  		cb();
		  });
  	});
  }

};