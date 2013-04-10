/**************************
 * 	Real Time Node Js Server
 * 
 * 	@author Francisapache ssl node
 * 
 **************************/
//server setting
const modulePath = ''; // 로컬환경
const serverPort = 8000; 
const proxyPort = 9000;
const redisHost = '127.0.0.1';
const redisPort = 6379;

var fs = require('fs'),
	http = require('http'),
	https = require('https'),
	httpProxy = require(modulePath+'http-proxy');

var options = {
	https: {
		key: fs.readFileSync('C:/nodeJs/real/mirros.key').toString(),
		cert: fs.readFileSync('C:/nodeJs/real/mirros.crt').toString(),
		passphrase : 'q7bjvdqbe83lt0aj'
	}
};

httpProxy.createServer(serverPort, 'localhost', options).listen(proxyPort);

var server = http.createServer(function(request, response){
	console.log('Create Server Doing ... ');
}).listen(serverPort);
console.log('Server Listening on port ' + serverPort);

var socketio = require(modulePath+'socket.io');
var io = socketio.listen(server);

var redis = require(modulePath+'redis');
var subscriber = redis.createClient(redisPort, redisHost);
subscriber.auth('');
subscriber.on('error', function(err) {
	console.log('Error In Redis Server');
});
subscriber.subscribe('real_time');

io.set('log level', 1);
io.sockets.on('connection', function(socket){
//	console.log('Connection');
	
	socket.on('disconnect', function() {
//		console.log('disconnect');
	});
});

subscriber.on('message', function(channel, message) {
	io.sockets.emit('real_time', message);
});

//Server
/*const modulePath = '/download/node-v0.10.3/node_modules/'; 
const serverPort = 8000; 
const proxyPort = 9000;
const redisHost = '127.0.0.1';
const redisPort = 6379;

var fs = require('fs'),
	http = require('http'),
	https = require('https'),
	httpProxy = require(modulePath+'http-proxy');

var options = {
	https: {
		key: fs.readFileSync('/etc/ssl/private/mirros.key').toString(),
		cert: fs.readFileSync('/etc/ssl/certs/mirros.crt').toString(),
		passphrase : 'q7bjvdqbe83lt0aj'
	}
};

httpProxy.createServer(serverPort, 'www.mirros.net', options).listen(proxyPort);

var server = http.createServer(function(request, response){
	console.log('Create Server Doing ... ');
}).listen(serverPort);
console.log("Server Listening on port " + serverPort);

var socketio = require(modulePath+'socket.io');
var io = socketio.listen(server);

var redis = require(modulePath+'redis');
var subscriber = redis.createClient(redisPort, redisHost);
subscriber.auth('');
subscriber.on('error', function(err) {
	console.log('Error In Redis Server');
});
subscriber.subscribe('real_time');

io.set('log level', 1);
io.sockets.on('connection', function(socket){
//	console.log('Connection');

	socket.on('disconnect', function() {
//		console.log('disconnect');
	});
});

subscriber.on('message', function(channel, message) {
	io.sockets.emit('real_time', message);
});*/