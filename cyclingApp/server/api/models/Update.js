module.exports = {

  attributes: {
  	checkpoint: {model: "Checkpoint", via: "updates", required: true},
  	rider: {model: "Rider", via: "updates", required: true},
  	updateString: {type: "string", required: true}
  },
  afterCreate: function(u,cb)
  {
  	Rider.update({id:u.rider},{lastUpdate: u.updateString})
  	.exec(function afterwards(err, updated){
	  	Checkpoint.findOne({id:u.checkpoint})
	  	.exec(function afterwards(err, record){
  			console.log("RIDER",updated);
	  		console.log("CHECKPOINT",record);
	  		record.updateString = (updated.number || "no Number") + " Passed checkpoint";
	  		record.save();
	  		console.log("CHECKPOINT",record);
	  		cb();
		});
  	});
  }

};