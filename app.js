var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

server.listen(port, function ()
{
	var addr = server.address();
	console.log('app listening on http://' + addr.address + ':' + addr.port);
});

app.get('/', function(req, res)
{
	res.sendFile(__dirname + '/index.html');
});

app.get('/img/mic128.png', function(req, res)
{
	res.sendFile(__dirname + '/img/mic128.png');
});

app.get('/recorder.js', function(req, res)
{
	res.sendFile(__dirname + '/recorder.js');
});

io.on('connection', function(socket)
{
	var sessionId = socket.id;
	console.log(sessionId + ' connected');
	
	socket.on('disconnect', function()
	{
		console.log(sessionId + ' disconnected');
	});
	
	socket.on('audio message', function(buf)
	{
		var fs = require('fs');
		var fileName = 'sound_' + sessionId + '.wav';
		
		//console.log(buf);
		console.log('writing ' + fileName);
		fs.writeFile(fileName, buf);
		
		io.emit('chat message', 'received sound!');
	});
});
