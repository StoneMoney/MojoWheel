![alt text](https://stonemoney.github.io/mojowheelassets/logo.svg "MojoWheel")
#
Websocket program for twitch stream overlays. Click to spin the wheel and it will randomly select one of the submitted strings via result.html, which would be captured in XSplit/OBS as a BrowserWindow.

## Getting started

Dependencies:
* Node.js & npm (6 recc)
* [npm ws](https://www.npmjs.com/package/ws)
* [npm glob](https://www.npmjs.com/package/glob)
* [npm opn](https://www.npmjs.com/package/opn)
* [npm jsonfile](https://www.npmjs.com/package/jsonfile)
* [npm fs-extra](https://www.npmjs.com/package/fs-extra)
Just use ``npm install`` to get everything needed.

Index.html is the controller where you can add, remove, spin, and view the prompts.

Results.html is front-end visual graphics of the wheel including sound and animations.

Server.js is the websocket server which passes along the strings, and also stores them locally. Runs default on port 8080

To start the server run ``node main.js`` or ``npm start``

To compile the server into an exe: ``pkg --output MojoWheel.exe --targets node6-win-x86 main.js``

## Todo & Future features
* macOS & Linux support
* Import lists
