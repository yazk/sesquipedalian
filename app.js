var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

var userQueue = [];

// HTTP Server
server.listen(port, function ()
{
	var addr = server.address();
	console.log('app listening on http://' + addr.address + ':' + addr.port);
});

// Serve files
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

// Socket logic
function handleConnection(socket)
{
	var sessionId;

	sessionId = socket.id;

	userQueue.push(sessionId);

	console.log(sessionId + ' connected');
	console.log('there are ' + userQueue.length + ' users in the queue: ' + userQueue + '\n');

	socket.on('disconnect', function ()
	{
		console.log(sessionId + ' disconnected');
	
		for ( var i = 0; i < userQueue.length; ++i )
		{
			if ( userQueue[i] === sessionId )
			{
				userQueue.splice(i, 1);
				break;
			}
		}
	
		console.log('there are ' + userQueue.length + ' users in the queue: ' + userQueue + '\n');
	});

	socket.on('audio message', function (buf)
	{
		var fs = require('fs');
		var fileName = 'sound_' + sessionId + '.wav';
	
		//console.log(buf);
		console.log('writing ' + fileName);
		fs.writeFile(fileName, buf);
	
		io.emit('chat message', 'received sound!');

		io.emit('audio message', buf);
	});
}

io.on('connection',  handleConnection );