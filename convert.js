//Converts wheel items to new exportable and importable format
const glob = require("glob"), 
	  jsonfile = require("jsonfile"),
	  fs = require('fs-extra'),
	  prompts = require('prompt'),
	  path = require("path");
const dataFolder = process.env.APPDATA+'\\MojoWheel\\data';
var wheelBase = path.join(__dirname, '/wheel-string-storage.array')
var theStrings = [];
if (!fs.existsSync(dataFolder)){
    console.log("No strings found to convert.")
} else {
if(fs.existsSync(dataFolder+"/wheel-string-storage.array")) { //check if file exists
	console.log("Existing array detected! Continue? This will add all strings within wheel-*.txt files to the array. This WILL clear the existing array")
	prompts.start();
	var property = {
	  name: 'yesno',
	  message: 'are you sure?',
	  validator: /y[es]*|n[o]?/,
	  warning: 'Must respond yes or no',
	  default: 'no'
	};
	prompts.get(property, function (err, result) {
		if(result.yesno == "yes") {
			startConvert()
		} else if (result.yesno == "no") {
			console.log("Understandable, have a nice day")
		}
  });
} else {
	startConvert()
}
function startConvert() {
	fs.copySync(wheelBase,dataFolder+'/wheel-string-storage.array');
	glob(dataFolder+"/wheel-*.txt", function (er, files) {
		files.forEach(function(matchingFile) {
			fs.readFile(matchingFile, 'utf8', function(err, data){
				if(!err) {
					theStrings.push(data);
				}
			})
		});
	});
	setTimeout(function(){
		pushStrings(theStrings)
	},1000);
	function pushStrings(array) {
		fs.readFile(dataFolder+"/wheel-string-storage.array", function (err, arrayFile) {
			var arrayFile = JSON.parse(arrayFile);
			for(var i = 0;i <= array.length; i++) {
				if(i == array.length) {
					fs.writeFile(dataFolder+"/wheel-string-storage.array", JSON.stringify(arrayFile), function (err) {
						if (err)  console.log('Error: ', err);
					});
				} else {
					arrayFile.push(array[i]);
				}
			}
		});
	}
	console.log("Done.");
}
}
