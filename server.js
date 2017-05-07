//█▀▄▀█ █▀▀█ ░░▀ █▀▀█ █░░░█ █░░█ █▀▀ █▀▀ █░░
//█░▀░█ █░░█ ░░█ █░░█ █▄█▄█ █▀▀█ █▀▀ █▀▀ █░░
//▀░░░▀ ▀▀▀▀ █▄█ ▀▀▀▀ ░▀░▀░ ▀░░▀ ▀▀▀ ▀▀▀ ▀▀▀
//1.1 by stonemoney
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });
var fs = require('fs');
var glob = require("glob");
const dataFolder = '/data/';
var pattern1 = "^addtogoalwheel ([0-9]+) (.*)";
var re1 = new RegExp(pattern1,'i');
var pattern2 = "^removefromwheel ([0-9]+)";
var re2 = new RegExp(pattern2,'i');
wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
	if (re1.test(message)) {
		var matches = message.match(pattern1);
		fs.writeFile('data/wheel-'+matches[1]+'.txt', matches[2], function (err) {
			if (err)  console.log('Error: ', err);
		});
	};
	if (re2.test(message)) {
		var matches = message.match(pattern2);
		fs.unlink('data/wheel-'+matches[1]+'.txt', function (err) {
			if (err)  console.log('Error: ', err);
		});
	};
	if(message == "requesting") {
		glob("data/wheel-*.txt", function (er, files) {
			files.forEach(function(matchingFile) {
				wss.clients.forEach(function each(client) {
					fs.readFile(matchingFile, 'utf8', function(err, data){
						if(!err) {
							var step1 = matchingFile.replace("data/wheel-","");
							var itemNo = step1.replace(".txt","");
							client.send("sendtowheel "+itemNo+" "+data);
						}
					});
				});
			});
		});
	}
	wss.clients.forEach(function each(client) {
		if (client !== ws && client.readyState === WebSocket.OPEN) {
				client.send(message);
		}
	});
  });
});
