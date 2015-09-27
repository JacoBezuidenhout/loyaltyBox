var scraperjs = require('scraperjs');
var util = require('util');
fs = require('fs');
var riders = [];
var fileIndex = 8000;

var run = function(id)
{
    scraperjs.StaticScraper.create('http://www.saseeding.co.za/seeding-search/?id=' + id)
    .scrape(function($) {
        // return $("#content-wrapper p").map(function() {
        var obj = {};
        var tmp = $(".page-comments > table p").map(function() {
            return $(this).text();
        }).get();
        // console.log(tmp);
        
        obj.idSas = id;
        obj.idNum = tmp[0];
        obj.sasNum = tmp[1];
        obj.name = tmp[2];
        obj.surname = tmp[3];
        obj.category= tmp[4];

        return obj;
    }, function(news) {
        if (news.sasNum == '')
        {
            run(id+1);
        }
        else
        {
            riders.push(news);
            console.log(news,riders.length);
            if (riders.length % 1000 == 0)
            {
                fileIndex += riders.length;
                fs.writeFileSync('./data' + fileIndex + '.json', JSON.stringify(riders,null,4) , 'utf-8');
                riders = [];
            }
            run(id+1);
        }
    })
}

run(8801);