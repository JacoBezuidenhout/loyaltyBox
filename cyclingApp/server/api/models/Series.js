/*
http://localhost:1337/series/create?title=National%20MTB%20SERIES&desc=Ashburton%20Investments&image=nationalmtb.png
http://localhost:1337/series/create?title=OatWell%20DUALX'&desc=Momentum%20Health&image=dualx.png
http://localhost:1337/series/create?title=Trailseeker'&desc=NISSAN&image=trailseeker.jpg
http://localhost:1337/series/create?title=TOUR%20OF%20LEGENDS'&desc=MTN&image=tol.jpg
*/
module.exports = {

  attributes: {
  	title: "string",
  	desc: "string",
  	image: "string",
  	sponsorImage: "string",
  	races: {collection: "Race", via: "series"}
  }
};