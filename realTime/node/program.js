/**************************
 * 	Real Time Node Js Server
 * 
 * 	@author Francisapache ssl node
 * 
 **************************/
const modulePath = '';
const redisHost = '127.0.0.1';
const proxyDomain = 'localhost';
const serverPort = 8000; 
const proxyPort = 9000;
const redisPort = 6379;

var fs = require('fs'),
	http = require('http'),
	//https = require('https'),
	httpProxy = require(modulePath+'http-proxy'),	
	redis = require(modulePath+'redis'),
	socketio = require(modulePath+'socket.io'),
	mysql = require(modulePath+'mysql');

var ssl_options = {
	https: {
		key: fs.readFileSync('C:/nodeJs/real/mirros.key').toString(),
		cert: fs.readFileSync('C:/nodeJs/real/mirros.crt').toString(),
		passphrase : 'q7bjvdqbe83lt0aj'
	}
};
var mysql_options = {
	host : 'localhost',
	user : 'kims0121',
	password : 'sg3512af@'
};
/*************************
 * 	6379 Redis Client 
 *************************/
var socketRedis = redis.createClient(redisPort, redisHost);
//socketRedis.auth('jt0308pk!');
socketRedis.auth('');
socketRedis.on('error', function(err) {
	console.log('Error In Redis Server');
});
socketRedis.subscribe('real_time');
socketRedis.subscribe('love_rank');
socketRedis.on('message', function(channel, message) {
	console.log('Channel : '+ channel + ' Message : ' + message);
	io.sockets.emit(channel, message);
});
/************************
 * 	mysql
 ************************/
setInterval(updateLoveRealCount, 864000000);
var connection = mysql.createConnection(mysql_options);
var mysqlRedis = redis.createClient(redisPort, redisHost);
mysqlRedis.auth('');
mysqlRedis.on('error', function(err) {
	console.log('Error In Redis Server');
});
function updateLoveRealCount(){
	connection.query('SELECT seller_pn FROM jtown.count_love_interval_1hour WHERE love_count >= 50', function(error, result, fields){
		if(error){
			console.log('Error In Mysql');
		}else{
			var sellerPnList = '';
			for(var i=0, len = result.length; i<len;i++){
				var obj = result[i];
				var sellerPn = obj.seller_pn;
				if((i+1) == len){
					sellerPnList += sellerPn;
				}else{
					sellerPnList += sellerPn+',';
				};
			};
			console.log(sellerPnList);
			mysqlRedis.publish('love_rank', sellerPnList);
		};
	});
};
/*************************
 * 	9000 Https Proxy Server 
 *************************/
//httpProxy.createServer(serverPort, proxyDomain, ssl_options).listen(proxyPort);
/*************************
 * 	8000 Http Server 
 *************************/
//var server = https.createServer(ssl_options.https).listen(serverPort);
var server = http.createServer().listen(serverPort);
/*************************
 * 	8000 Socket.io 
 *************************/
var io = socketio.listen(server);
io.set('log level', 2);
io.sockets.on('connection', function(socket){
	socket.log.info('Connection Socket');
	
	socket.on('disconnect', function() {
		socket.log.info('Disconncet Socket');
		socket.leave();
	});
});

//Server
//const modulePath = '/node_modules/'; 
//const redisHost = '127.0.0.1';
//const proxyDomain = 'www.mirros.net';
//const serverPort = 8000; 
//const proxyPort = 9000;
//const redisPort = 6379;
//
//var fs = require('fs'),
//	http = require('http'),
//	https = require('https'),
//	httpProxy = require(modulePath+'http-proxy'),	
//	redis = require(modulePath+'redis'),
//	socketio = require(modulePath+'socket.io'),
//	mysql = require(modulePath+'mysql');
//
//var ssl_options = {
//	https: {
//		key: fs.readFileSync('/etc/ssl/private/mirros.key').toString(),
//		cert: fs.readFileSync('/etc/ssl/certs/mirros.crt').toString(),
//		passphrase : 'q7bjvdqbe83lt0aj'
//	}
//};
//var mysql_options = {
//	host : 'localhost',
//	user : 'root',
//	password : 'jt0308pk!'
//};
///*************************
// * 	6379 Redis Client 
// *************************/
//var socketRedis = redis.createClient(redisPort, redisHost);
//socketRedis.auth('');
//socketRedis.on('error', function(err) {
//	console.log('Error In Redis Server');
//});
//socketRedis.subscribe('real_time');
//socketRedis.subscribe('love_rank');
//socketRedis.on('message', function(channel, message) {
////	console.log('Channel : '+ channel + ' Message : ' + message);
//	io.sockets.emit(channel, message);
//});
///************************
// * 	mysql
// ************************/
//setInterval(updateLoveRealCount, 600000);
//var connection = mysql.createConnection(mysql_options);
//var mysqlRedis = redis.createClient(redisPort, redisHost);
//mysqlRedis.auth('');
//mysqlRedis.on('error', function(err) {
//	console.log('Error In Redis Server');
//});
//function updateLoveRealCount(){
//	connection.query('SELECT seller_pn FROM jtown.count_love_interval_1hour WHERE love_count >= 20', function(error, result, fields){
//		if(error){
//			console.log('Error In Mysql');
//		}else{
//			var sellerPnList = '';
//			for(var i=0, len = result.length; i<len;i++){
//				var obj = result[i];
//				var sellerPn = obj.seller_pn;
//				if((i+1) == len){
//					sellerPnList += sellerPn;
//				}else{
//					sellerPnList += sellerPn+',';
//				};
//			};
////			console.log(sellerPnList);
//			mysqlRedis.publish('love_rank', sellerPnList);
//		};
//	});
//};
///*************************
// * 	9000 Https Proxy Server 
// *************************/
////httpProxy.createServer(serverPort, proxyDomain, ssl_options).listen(proxyPort);
///*************************
// * 	8000 Http Server 
// *************************/
//var server = https.createServer(ssl_options.https).listen(serverPort);
///*************************
// * 	8000 Socket.io 
// *************************/
//var io = socketio.listen(server);
//io.set('log level', 1);
//io.sockets.on('connection', function(socket){
//	socket.log.info('Connection Socket');
//	
//	socket.on('disconnect', function() {
//		socket.log.info('Disconncet Socket');
//		socket.leave();
//	});
//});