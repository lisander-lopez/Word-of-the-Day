var wordOfTheDayApp = angular.module('wordOfTheDayApp', []);

wordOfTheDayApp.controller('mainCtrl', ['$scope', '$http', '$log', function($scope, $http, $log) {
	$log.debug('Starting...');
	var mC = this;	// Setting mC as this
	mC.wordOfTheDay = '';
    mC.wordTime = '';
  
	mC.updateWord = function(word) {
		var data = { word: word };
		$http.post("/wordOfTheDay", data).then(function(res){
			$log.debug('Updating Word...');
			if (res.status === 200) {
				mC.user_word= ''; // Set  input box to nothing
				$log.info('Updated Word!');	// Log that we updated the word
			} else {
				$log.error('Did not receive 200 Status Code');
			};
		});
	}

	mC.getWord = function() {
		$http.get('/wordOfTheDay').then(function(res) {
			$log.debug('Getting Word of the Day...');
			if (res.status === 200) {
				$log.info('Got the Word!');
				console.info('The word is ' + res.data.data[0].word);
				mC.wordOfTheDay = res.data.data[0].word;
                mC.wordTime = res.data.data[0].time;
			} else {
				$log.error('Did not receive 200 Status Code');
			};	
		});
	}

	var socket = io.connect('http://localhost:3000', { reconnect: true});	// Connects to socket!
	// If there is a socket (if connected), then... of not..
	if (socket) {		
		$log.debug('Connected to Server'); //Log Conneced to the Server
				
		mC.getWord(); // Get current word on the server
		
		socket.on('update', function(data) {
			// If we have data then we are connected if not, tell the user we are not connected
			if (data) {
				$log.info('Received Data');	// Log that we recieved data.
				mC.wordOfTheDay = data[0].word;	// Set word from database to wordOfTheDay Variable, will be changed in the DOM thanks to angular
                mC.wordTime = data[0].time;
				console.log(data); // log the data
			} else {
				$log.error('Did not receive Data?'); // Log that we did not receive data
				mC.wordOfTheDay = 'Error!';
				console.log(data); // log the data
			}
		});
	} else {
		$log.error('Could not connect to Server!');	// log error
		alert('Could not connect to Server! \n I will refresh the page');	// Tell the User we are going to refresh the page
		location.reload();	// Refresh the page
	};
}]);

