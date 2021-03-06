var mongoose = require('mongoose');
var Artist = mongoose.model('Artist');
var lastFmService = require('../../services/LastFmApi');

var storeArtist = function(postedArtist, callback){

    Artist.findOne({ 'name': postedArtist }, 'name numberOfRequests', function (err, artist) {
      if (err) return console.log(err);

      if (artist != null) {
          //artist already exists in the db. Just update it.
          artist.update({$inc: {numberOfRequests:1}}, function (err){
              if (err) return console.log(err);
          });

      }else{
          //add the artist to the db.
          var newArtist = new Artist({ name: postedArtist, numberOfRequests: 1});
        newArtist.save(function (err, newArtist) {
          if (err) return console.log(err);
          console.log("saved into db: " + newArtist.name);
        });
      }

    });
};

exports.getArtist = function(req, res){
    // /api/artist?name=madonna
    var artist = req.query.name;

    lastFmService
        .getArtistData(artist, 'info')
        .then(function(infoRes){
            var artistData = JSON.parse(infoRes[0].body);
            //store the requested artist in the DB.
            //this runs asynchronously, so no delay to send the data
            storeArtist(artistData.artist.name, function(){
            });

            res.json(artistData);
        }).fail(function(error){
            console.log(error);
            res.json(500, { error: "error" });
        });
};
