console.log("Running! Close this window or press Ctrl+C when you are finished");
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });
var http = require('http'),
    fs = require('fs');
//host controller on port 8000
var path = require("path");
var index = path.join(__dirname, '/index.html')
var result = path.join(__dirname, '/result.html')
var bitsImage = path.join(__dirname, '/bit.png')
var spinSound = path.join(__dirname, '/spinningsound.ogg')
//fs
const baseFolder = process.env.APPDATA+'\\MojoWheel';
const dataFolder = process.env.APPDATA+'\\MojoWheel\\data';
var fs = require('fs-extra');
if (!fs.existsSync(baseFolder)){
    fs.mkdirSync(baseFolder);
}
if (!fs.existsSync(dataFolder)){
    fs.mkdirSync(dataFolder);
}
//glob
var glob = require("glob");
//opn
var opn = require("opn");
//regex
var pattern1 = "^addtogoalwheel ([0-9]+) (.*)";
var re1 = new RegExp(pattern1,'i');
var pattern2 = "^removefromwheel ([0-9]+)";
var re2 = new RegExp(pattern2,'i');
fs.copySync(result,baseFolder+'/result.html'); //only for compiler
fs.copySync(spinSound,baseFolder+'/spinningsound.ogg');
fs.copySync(bitsImage,baseFolder+'/bit.png');
fs.readFile(index, function (err, html) {
    if (err) {
        throw err; 
    }       
    http.createServer(function(request, response) {  
        response.writeHeader(200, {"Content-Type": "text/html"});  
        response.write(html);  
        response.end();  
    }).listen(8000);
});
opn('http://localhost:8000');
wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
	if (re1.test(message)) {
		var matches = message.match(pattern1);
		fs.writeFile(dataFolder+'/wheel-'+matches[1]+'.txt', matches[2], function (err) {
			if (err)  console.log('Error: ', err);
		});
	};
	if (re2.test(message)) {
		var matches = message.match(pattern2);
		fs.unlink(dataFolder+'/wheel-'+matches[1]+'.txt', function (err) {
			if (err)  console.log('Error: ', err);
		});
	};
	if(message == "requesting") {
		glob(dataFolder+"/wheel-*.txt", function (er, files) {
			files.forEach(function(matchingFile) {
					fs.readFile(matchingFile, 'utf8', function(err, data){
						if(!err) {
							matchingFile = matchingFile.replace(/\//g,'\\'); //make sure consistant with entire program
							var step1 = matchingFile.replace(dataFolder+"\\wheel-","");
							var itemNo = step1.replace(".txt","");
							wss.clients.forEach(function each(client) {
								client.send("sendtowheel "+itemNo+" "+data);
							});
						}
					});
			});
		});
		wss.clients.forEach(function each(client) {
			client.send("location "+baseFolder);
		});
	}
	wss.clients.forEach(function each(client) {
		if (client !== ws && client.readyState === WebSocket.OPEN) {
				client.send(message);
		}
	});
  });
});
