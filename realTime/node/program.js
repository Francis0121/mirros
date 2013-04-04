/**************************
 * 	Real Time Node Js Server
 * 
 * 	@author Francis
 * 
 **************************/
//server setting
//const modulePath = '/root/node_modules/';
//const modulePath = '/download/node-v0.10.3/node_modules/';
const modulePath = '';
const serverPort = 8000;

const redisHost = '127.0.0.1';
const redisPort = 6379;

//open node server
var http = require('http');
var server = http.createServer(function(request, response){
//	console.log("Create Server Doing ... ");
}).listen(serverPort);
//console.log("Server Listening on port " + serverPort);

//set SocketIo And Connection Socket
var socketio = require(modulePath+'socket.io');
var io = socketio.listen(server);

//TODO Redis 비밀번호 설정
//set Redis 
var redis = require(modulePath+'redis');
//connection redis 
var subscriber = redis.createClient(redisPort, redisHost);
subscriber.auth("");
subscriber.on("error", function(err) {
	console.log('Error In Redis Server');
});
subscriber.subscribe("real_time");

// Test 할 경우에는 log level 2로 두고 test
io.set('log level', 1);
io.sockets.on('connection', function(socket){
	//You need Authortiy From page 
//	socket.emit('authority');
//	socket.on('authority_page', function(msg) {
//		console.log('Connection Authority: ' + msg);
//		socket.join(msg);
//	});

	socket.on('disconnect', function() {
//		console.log('disconnect');
	});
});

subscriber.on('message', function(channel, message) {
//	console.log('Redis Connection' + message);
	//Broadcast
	io.sockets.emit('real_time', message);
	
	//You need Authortiy From page
	//io.sockets.in(id).emit("real_time", message);
});