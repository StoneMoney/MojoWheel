const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });
var fs = require('fs');

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
		if(message.startsWith("addtogoalwheel 1 ")) {
			var formattedText1 = message.replace("addtogoalwheel 1 ","");
			fs.writeFile('data/wheel-1.txt', formattedText1, function (err) {
				if (err)  console.log('Error: ', err);
			});
		} else if(message.startsWith("addtogoalwheel 2 ")) {
			var formattedText2 = message.replace("addtogoalwheel 2 ","");
			fs.writeFile('data/wheel-2.txt', formattedText2, function (err) {
				if (err)  console.log('Error: ', err);
			});
		} else if(message.startsWith("addtogoalwheel 3 ")) {
			var formattedText3 = message.replace("addtogoalwheel 3 ","");
			fs.writeFile('data/wheel-3.txt', formattedText3, function (err) {
				if (err)  console.log('Error: ', err);
			});
		} else if(message.startsWith("addtogoalwheel 4 ")) {
			var formattedText4 = message.replace("addtogoalwheel 4 ","");
			fs.writeFile('data/wheel-4.txt', formattedText4, function (err) {
				if (err)  console.log('Error: ', err);
			});
		} else if(message.startsWith("addtogoalwheel 5 ")) {
			var formattedText5 = message.replace("addtogoalwheel 5 ","");
			fs.writeFile('data/wheel-5.txt', formattedText5, function (err) {
				if (err)  console.log('Error: ', err);
			});
		} else if(message.startsWith("addtogoalwheel 6 ")) {
			var formattedText6 = message.replace("addtogoalwheel 6 ","");
			fs.writeFile('data/wheel-6.txt', formattedText6, function (err) {
				if (err)  console.log('Error: ', err);
			});
		} else if(message.startsWith("addtogoalwheel 7 ")) {
			var formattedText7 = message.replace("addtogoalwheel 7 ","");
			fs.writeFile('data/wheel-7.txt', formattedText7, function (err) {
				if (err)  console.log('Error: ', err);
			});
		} else if(message.startsWith("addtogoalwheel 8 ")) {
			var formattedText8 = message.replace("addtogoalwheel 8 ","");
			fs.writeFile('data/wheel-8.txt', formattedText8, function (err) {
				if (err)  console.log('Error: ', err);
			});
		}
	if(message == "requesting") {
		console.log("request received");
		wss.clients.forEach(function each(client) {
		  if (client.readyState === WebSocket.OPEN) {
			fs.readFile('data/wheel-1.txt', 'utf8', function(err, data){
				if(!err) {
					client.send("sendtowheel 1 "+data);
				}
			});
			fs.readFile('data/wheel-2.txt', 'utf8', function(err, data){
				if(!err) {
					client.send("sendtowheel 2 "+data);
				}
			});
			fs.readFile('data/wheel-3.txt', 'utf8', function(err, data){
				if(!err) {
					client.send("sendtowheel 3 "+data);
				}
			});
			fs.readFile('data/wheel-4.txt', 'utf8', function(err, data){
				if(!err) {
					client.send("sendtowheel 4 "+data);
				}
			});
			fs.readFile('data/wheel-5.txt', 'utf8', function(err, data){
				if(!err) {
					client.send("sendtowheel 5 "+data);
				}
			});
			fs.readFile('data/wheel-6.txt', 'utf8', function(err, data){
				if(!err) {
					client.send("sendtowheel 6 "+data);
				}
			});
			fs.readFile('data/wheel-7.txt', 'utf8', function(err, data){
				if(!err) {
					client.send("sendtowheel 7 "+data);
				}
			});
			fs.readFile('data/wheel-8.txt', 'utf8', function(err, data){
				if(!err) {
					client.send("sendtowheel 8 "+data);
				}
			});
		  }
		});
	}
		wss.clients.forEach(function each(client) {
		  if (client !== ws && client.readyState === WebSocket.OPEN) {
			client.send(message);
		  }
		});
	});
});

