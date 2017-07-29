console.log("Running MOJOWHEEL [@ngiano]! Close this window or press Ctrl+C when you are finished");
//node-modules
const http = require('http'),
    //fs = require('fs'),
	WebSocket = require('ws'),
	path = require("path"),
	fs = require('fs-extra'),
	opn = require("opn"),
	glob = require("glob"),
	jsonfile = require("jsonfile");
const wss = new WebSocket.Server({ port: 8080 });
//paths for required files
var index = path.join(__dirname, '/index.html')
var result = path.join(__dirname, '/result.html')
var bitsImage = path.join(__dirname, '/bit.png')
var spinSound = path.join(__dirname, '/spinningsound.ogg')
var config = path.join(__dirname, '/config-1.3.JSON')
var logo = path.join(__dirname, '/logo.svg')
var wheelBase = path.join(__dirname, '/wheel-string-storage.array')
//app workspace
const baseFolder = process.env.APPDATA+'\\MojoWheel';
const dataFolder = process.env.APPDATA+'\\MojoWheel\\data';
//create folders for workspace, if they don't exist already
if (!fs.existsSync(baseFolder)){
    fs.mkdirSync(baseFolder);
}
if (!fs.existsSync(dataFolder)){
    fs.mkdirSync(dataFolder);
}
//regex
var pattern1 = "^addtogoalwheel (.*)";
var re1 = new RegExp(pattern1,'i');
var pattern2 = "^removefromwheel (.*)";
var re2 = new RegExp(pattern2,'i');
var pattern3 = "^sendconfig ([a-z]+) (.*)";
var re3 = new RegExp(pattern3,'i');
//send local copies of files to workspace
fs.copySync(result,baseFolder+'/result.html');
fs.copySync(spinSound,baseFolder+'/spinningsound.ogg');
fs.copySync(bitsImage,baseFolder+'/bit.png');
function restoreToDefault() {
	fs.copySync(config,baseFolder+'/config-1.3.JSON'); //protect file from overwriting each time exe is ran
}
if(!fs.existsSync(baseFolder+"/config-1.3.JSON")) { //check if config file exists
	restoreToDefault();
}
if(!fs.existsSync(dataFolder+"/wheel-string-storage.array")) {
	fs.copySync(wheelBase,dataFolder+'/wheel-string-storage.array');
	console.log("No wheel array file located! Creating a new one. If you were using a previous version of MojoWheel and would like to transfer your options, get the conversion tool on github. A link can be found in the corner of the dashboard")
}
//hosting index.html on localhost:8000 instead of also moving it to workspace
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
//open localhost:8000 in default browser
opn('http://localhost:8000');
wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
	if (re1.test(message)) {
		fs.readFile(dataFolder+"/wheel-string-storage.array", function (err, arrayFile) {
			var matches = message.match(pattern1);
			arrayFile = JSON.parse(arrayFile);
			if(!err) {
				arrayFile.push(matches[1]);
				fs.writeFile(dataFolder+"/wheel-string-storage.array", JSON.stringify(arrayFile), function (err) {
					if (err)  console.log('Error: ', err);
				});
			}
		});
	};
	if (re2.test(message)) {
		var matches = message.match(pattern2);
		var textToRemove = matches[1]
		console.log(textToRemove);
		fs.readFile(dataFolder+"/wheel-string-storage.array", function (err, arrayFile) {
			if(!err) {
				arrayFile = JSON.parse(arrayFile);
				var spliceIndex = arrayFile.indexOf(textToRemove);
				if(spliceIndex != -1) {
					arrayFile.splice(spliceIndex, 1);
					fs.writeFile(dataFolder+"/wheel-string-storage.array", JSON.stringify(arrayFile), function (err) {
						if (err)  console.log('Error: ', err);
					});
				}
			}
		});
	};
	if(message == "requesting") {
		fs.readFile(dataFolder+"/wheel-string-storage.array", function (err, arrayFile) {
			if(!err) {
				wss.clients.forEach(function each(client) {
					client.send("sendtowheel "+arrayFile);
				});
				wss.clients.forEach(function each(client) {
					client.send("location "+baseFolder);
				});
			}
		});
	}
	if(message == "dash-requesting") {
		sendConfig();
		fs.readFile(dataFolder+"/wheel-string-storage.array", function (err, arrayFile) {
			if(!err) {
				wss.clients.forEach(function each(client) {
					client.send("sendtodash "+arrayFile);
				});
			}
		});
		wss.clients.forEach(function each(client) {
			client.send("location "+baseFolder);
		});
	}
	if(message == "wheel-requesting") {
		sendConfig();
		fs.readFile(dataFolder+"/wheel-string-storage.array", function (err, arrayFile) {
			if(!err) {
				wss.clients.forEach(function each(client) {
					client.send("sendtowheel "+arrayFile);
				});
				wss.clients.forEach(function each(client) {
					client.send("location "+baseFolder);
				});
			}
		});
		wss.clients.forEach(function each(client) {
			client.send("location "+baseFolder);
		});
	}
	if(message == "refresh-wheel") {
		wss.clients.forEach(function each(client) {
			client.send("refresh-wheel");
		});
	}
	if(message.startsWith("wheelselected")) {
		wss.clients.forEach(function each(client) {
			client.send(message);
		});
	}
	if(message == "spin") {
		wss.clients.forEach(function each(client) {
			client.send("spin");
		});
	}
	if(message == "restoretodefault") {
		restoreToDefault();
		sendConfig();
	}
	if(message == "config-request") {
		sendConfig();
	}
	if(re3.test(message)) {
		var matches = message.match(pattern3);  
		replaceConfigString(matches[1],matches[2]);
	}
	if(message == "openDataFolder") {
		opn(dataFolder);
	}
	//wss.clients.forEach(function each(client) {
	//	if (client !== ws && client.readyState === WebSocket.OPEN) {
	//			client.send(message);
	//	}
	//});
	});
	function replaceConfigString(configOption, message) {
		jsonfile.readFile(baseFolder+"/config-1.3.JSON", function (err,obj) {
			try {
				for (var i=0; i< obj.length; i++) {
					if (obj[i]['config'] == configOption) {
						obj[i]['theOption'] = message;
						jsonfile.writeFileSync(baseFolder+"/config-1.3.JSON", obj);
						break;
					}
				}
			} catch(err) {
				
			}
		});
	}
	function sendConfig() {
		jsonfile.readFile(baseFolder+"/config-1.3.JSON", function (err,obj) {
				wss.clients.forEach(function each(client) {
					for (var i=0; i< obj.length; i++) {
						var configOption = obj[i]['config'];
						var message = obj[i]['theOption'];
						client.send("config "+configOption+" "+message);
					}
				});
		});
	}
});