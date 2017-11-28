var moment = require('moment');
//Function to return date in the following format
// if the date is Jan 1 2017 2pm then the function should output 1/1/17-2:00:00
module.exports.getServerTime = function() 
	return moment().format('lll');
}

module.exports.getWord = function (_db, _wordId) {
	_db.wordOfTheDay.find({ "_id": _wordId }, function(err, data) { 
		console.log(data);
		return data
	});
}