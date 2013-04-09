/**************************
 * 	Real Time Node Js Server
 * 
 * 	@author Francisapache ssl node
 * 
 **************************/
//server setting
//const modulePath = '/root/node_modules/'; // 테스트 서버 환경
const modulePath = '/download/node-v0.10.3/node_modules/'; // 실 서버
//const modulePath = ''; // 로컬환경
const serverPort = 8000; 
const proxyPort = 9000;
const redisHost = '127.0.0.1';
const redisPort = 6379;

//open node server
var fs = require('fs'),
	http = require('http'),
	https = require('https'),
	httpProxy = require(modulePath+'http-proxy');

var options = {
	https: {
		key: fs.readFileSync('/etc/ssl/private/mirros.key').toString(),
		cert: fs.readFileSync('/etc/ssl/certs/mirros.crt').toString(),
		passphrase : 'q7bjvdqbe83lt0aj'
//		key: fs.readFileSync('C:/nodeJs/real/mirros.key').toString(),
//		cert: fs.readFileSync('C:/nodeJs/real/mirros.crt').toString(),
//		passphrase : 'q7bjvdqbe83lt0aj'
	}
};

httpProxy.createServer(serverPort, 'www.mirros.net', options).listen(proxyPort);
//httpProxy.createServer(serverPort, 'localhost', options).listen(proxyPort);

// ~ Server
var server = http.createServer(function(request, response){
	console.log("Create Server Doing ... ");
}).listen(serverPort);
console.log("Server Listening on port " + serverPort);

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
	console.log('Connection');
//	socket.emit('authority');
//	socket.on('authority_page', function(msg) {
//		console.log('Connection Authority: ' + msg);
//		socket.join(msg);
//	});

	socket.on('disconnect', function() {
		console.log('disconnect');
	});
});

subscriber.on('message', function(channel, message) {
//	console.log('Redis Connection' + message);
	//Broadcast
	io.sockets.emit('real_time', message);
	
	//You need Authortiy From page
	//io.sockets.in(id).emit("real_time", message);
});