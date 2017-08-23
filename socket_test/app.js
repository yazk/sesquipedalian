var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

server.listen(port, function () {  
	var addr = server.address();
	console.log('   app listening on http://' + addr.address + ':' + addr.port);
  });

app.get('/', function(req, res)
{
//	 res.send('<h1>hello world</h1>');
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
