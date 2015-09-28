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
   
          checkpoint.lastUpdate = (rider.number || "No Number") + " passed " + checkpoint.title;
          checkpoint.icon.markerColor = "green";
          checkpoint.lastRank = checkpoint.lastRank || 0;
          checkpoint.lastRank++;
          checkpoint.message = "<h2>" + checkpoint.title + "<h2><p>" + checkpoint.lastUpdate + "</p>";

          if (checkpoint.lastRank <= 20)
          {
            checkpoint.ranks = checkpoint.ranks || [];
            checkpoint.ranks.push({pos: checkpoint.lastRank, rider: {id: rider.id, name: rider.name, surname: rider.surname, number: rider.number}}); 
          }

          console.log("CHECKPOINT",checkpoint);
          checkpoint.save();
          
          rider.lastUpdate = u.updateString;
          rider.ranks = rider.ranks || [];
          rider.ranks.push({pos: checkpoint.lastRank, checkpoint: {id: checkpoint.id, title: checkpoint.title}});
          console.log("RIDER",rider);
          rider.save();

  	  		cb();
        // });
		  });
  	});
  }

};