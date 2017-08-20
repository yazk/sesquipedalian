var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res)
{
	// res.send('<h1>hello world</h1>');
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket)
{
	/*
	console.log('a user connected');
	
	socket.on('disconnect', function()
	{
		console.log('user disconnected');
	});
	*/
	
	socket.on('chat message', function(msg)
	{
		console.log('message: ' + msg);
		
		io.emit('chat message', msg);
	});
	
	socket.on('binary message', function(buf)
	{
		var fs = require('fs');
		
		console.log(buf);
		
		fs.writeFile('file', buf);
	});
});

http.listen(7777, function(){
	console.log('listening on *:7777');
});