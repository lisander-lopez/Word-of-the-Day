var socket = io.connect('http://localhost:3000', { reconnect: true});
console.log('connected');

socket.on('message', function(data) {
	console.log(data);
});