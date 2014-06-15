var groovesharkService = require('../services/groovesharkApi');

exports.index = function(req, res){

	var artist = req.query.artist;

	var songs = groovesharkService.getSongs(artist, function(error, response, songs){
		if (!error) {
            // res.format({
            //   "text/plain": function(){
            //     res.send(songs);
            // }});
            res.set('Content-Type', 'text/plain');
			res.send(songs);
		}else{
			res.send(error);
		}
	});

};