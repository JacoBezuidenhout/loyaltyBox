/**
 * RouteController
 *
 * @description :: Server-side logic for managing routes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

function mysortfunction(a, b) {

  var o1 = a.checkpoint.order;
  var o2 = b.checkpoint.order;

  var p1 = a.date;
  var p2 = b.date;

  if (o1 < o2) return 1;
  if (o1 > o2) return -1;
  if (p1 < p2) return -1;
  if (p1 > p2) return 1;
  return 0;
}

function riderExist(array,rider)
{
	for (var i = 0; i < array.length; i++) {
		if (array[i].rider.id == rider.id)
			return true;
	};
	return false;
}

function getPos(obj,rider)
{
	var ret = [];
	for (cp in obj)
	{
		for (var i = 0; i < obj[cp].ranks.length; i++) {
			if (obj[cp].ranks[i].rider.id == rider.id)
				ret.push(obj[cp].ranks[i].pos);
		};
	}
	return ret;
}

function getCpTotals(obj)
{
	var ret = [];
	for (cp in obj)
	{
		ret.push(obj[cp].count);
	}
	return ret;
}

var ROUTE = {
	getRanks: function(values,cb)
	{
			Route.findOne({id: values.id})
			.populate('checkpoints') 
			.exec(function(err,route){
				if (route)
				{
					var c = [];
					//get all checkpoint ids in an array
					for (var i = 0; i < route.checkpoints.length; i++) {
						console.log(route.checkpoints[i].id);
						c.push(route.checkpoints[i].id);
					};

					Update.find({checkpoint: c}).populate("checkpoint").populate("rider").sort("date ASC").exec(function(err,u){
						
						//sort by order desc then date asc
						var updates = u.sort(mysortfunction);

						var ranks = [];
						var l = [];
						var gt3 = [];
						var gt3Labels = [];
						var gct = [];
						var checkpointSummary = {};

						for (var i = 0; i < updates.length; i++) {
							if (!riderExist(ranks,updates[i].rider) && ranks.length < (values.limit || 10))
							{
								delete updates[i].rider.ranks;
								ranks.push({pos: (i+1), rider: updates[i].rider, date: updates[i].date, order: updates[i].checkpoint.order});
							}
							
							if (l.indexOf(updates[i].checkpoint.title) == -1)
							{
								l.push(updates[i].checkpoint.title);
							}

							checkpointSummary[updates[i].checkpoint.id] = checkpointSummary[updates[i].checkpoint.id] || {};
		
							checkpointSummary[updates[i].checkpoint.id].count = (checkpointSummary[updates[i].checkpoint.id].count || 0) + 1;
							checkpointSummary[updates[i].checkpoint.id].ranks = (checkpointSummary[updates[i].checkpoint.id].ranks || []);	
							checkpointSummary[updates[i].checkpoint.id].ranks.push({pos: (checkpointSummary[updates[i].checkpoint.id].ranks.length+1), rider: updates[i].rider, date: updates[i].date, order: updates[i].checkpoint.order});	
						};

						for (var i = 0; i < Math.min(3,ranks.length); i++) {
							gt3.push(getPos(checkpointSummary,ranks[i].rider).reverse());
							gt3Labels.push(ranks[i].rider.number + ": " + ranks[i].rider.name + " " + ranks[i].rider.surname);
						};
						
						gct = getCpTotals(checkpointSummary).reverse();
						l = l.reverse();

						for (var i = 0; i < (route.checkpoints.length-l.length); i++) {
							l.push("N/A");
							gct.push(null);
							for (var j = 0; j < gt3.length; j++) {
								gt3[j].push(null);
							};
						};

						cb
						(
							{
								route: route,
								graphData: {
									labels: l,
									graphTop3: {data: gt3, labels: gt3Labels},
									graphCheckpointTotals: gct
								}, 
								ranks: ranks
							}
						);
					});

				}
				else
					cb({error: "Route not found..."});
			});
	},
	getRank: function(values,cb)
	{
			Route.findOne({id: values.id})
			.populate('checkpoints') 
			.exec(function(err,route){
				if (route)
				{
					var c = [];
					//get all checkpoint ids in an array
					for (var i = 0; i < route.checkpoints.length; i++) {
						console.log(route.checkpoints[i].id);
						c.push(route.checkpoints[i].id);
					};

					Update.find({checkpoint: c}).populate("checkpoint").populate("rider").sort("date ASC").exec(function(err,u){
						
						//sort by order desc then date asc
						var updates = u.sort(mysortfunction);

						var l = [];
						var gt3 = [];
						var checkpointSummary = {};

						for (var i = 0; i < updates.length; i++) {						
							if (l.indexOf(updates[i].checkpoint.title) == -1) l.push(updates[i].checkpoint.title);

							checkpointSummary[updates[i].checkpoint.id] = checkpointSummary[updates[i].checkpoint.id] || {};
							checkpointSummary[updates[i].checkpoint.id].count = (checkpointSummary[updates[i].checkpoint.id].count || 0) + 1;
							checkpointSummary[updates[i].checkpoint.id].ranks = (checkpointSummary[updates[i].checkpoint.id].ranks || []);	
							checkpointSummary[updates[i].checkpoint.id].ranks.push({pos: (checkpointSummary[updates[i].checkpoint.id].ranks.length+1), rider: updates[i].rider, date: updates[i].date, order: updates[i].checkpoint.order});	
						};

						
						gt3 = getPos(checkpointSummary,values.rider).reverse();
						l = l.reverse();

						for (var i = 0; i < (route.checkpoints.length-l.length); i++) {
							l.push("N/A");
						};
						for (var i = 0; i < (route.checkpoints.length-gt3.length); i++) {
							gt3.push(null);
						};

						cb({rider: values.rider, graph: {labels: l, data: gt3, route: {title: route.title, id: route.id}}});
					});

				}
				else cb({error: "Route not found..."});
			});
	},
	rank: function(req,res)
	{
		var values = req.allParams();

		if (values.riderId)
		{
			Rider.findOne({id: values.riderId}).populate("routes").exec(function(err,rider){
				values.rider = rider;
				
				if ((rider.routes || []).length)
				{
					for (var i = 0; i < rider.routes.length; i++) {
						delete rider.routes[i].latlngs;
					};

					rider.routes = rider.routes.reverse();
					values.id = values.id || rider.routes[0].id;
					
					ROUTE.getRank(values,function(obj){
						res.json(obj);
					});
				}
				else
					res.json({error: "No route found"});

			});
		}
		else
		{
			res.json({error: "No id found"});
		}
	},
	ranks: function(req,res)
	{
		var values = req.allParams();
		if (values.id)
		{
			ROUTE.getRanks(values,function(obj){
				res.json(obj);		
			});
		}
		else
		{
			res.json({error: "ID not set..."});
		}
	}	
};

module.exports = ROUTE;