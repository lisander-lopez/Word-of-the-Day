/*
TO DO:
- Custom name who changed the word
- Track IP Address
- Try to encrpyt?
*/
var express = require('express');
var mongo = require('mongojs');
var app = express();

var mongojs = require('mongojs');
var db = mongojs('127.0.0.1:27017/wordOfTheDay', ['wordOfTheDay']);
var id = require('mongodb').ObjectID('59e03b169baaa91c31c80e75');

var bodyParser = require('body-parser');
var server = app.listen(3000);

var io = require('socket.io').listen(server);

var extras = require('./functions.js');

var socket;

app.use(express.static(__dirname + "/public"))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(req, res) {
	res.render('public/index.html');
});

app.get('/wordOfTheDay', function(req, res) {
	db.wordOfTheDay.find({ _id: id}, function(err, data) { 
		console.log(data);
		if (err) console.log(err); // If there is an error, log it
		
		res.send( {data} );
	});
});

app.post('/wordOfTheDay', function(req, res) {
    console.log(req.body.word);
    var wordToUpdate = req.body.word;
    //db.wordOfTheDay.update({_id: id}, update, [options], [callback])


	db.wordOfTheDay.findAndModify({
    query: { _id: id },
    update: { $set: { word: wordToUpdate, time: extras.getServerTime() } },
    new: false
	}, function (err, doc) {
		console.log('Queried the database');
	    if (err) {
	    	res.send({ error: err });
	    	console.log('Error Updating Word');
	    } else {
	    	db.wordOfTheDay.find({ _id: id}, function(err, data) { 
				console.log('New word is ' + data[0].word);
				//Here I would tell the server to tell EVERY client connected to get the new word. how can I do this?
				io.sockets.emit('update', data);
			});
	    	res.send({ success: 1 })
	    };
	})
});

io.on('connection', function(socket){	// When we get a connection
  socket = socket;
  console.log('User connected');	// Log a User Connected
  
  socket.on('disconnect', function() {	// When the user disconnects
  	console.log('User disconnected');	// Log the user disconnected
  });
});

console.log('Server running in port 3000');