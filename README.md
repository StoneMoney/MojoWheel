![alt text](https://stonemoney.github.io/images/mojowheel.png "MojoWheel")
# MojoWheel
Websocket program for twitch stream overlays. Click to spin the wheel and it will randomly select one of the submitted strings via result.html, which would be captured in XSplit/OBS as a BrowserWindow.

## Getting started

Dependencies:
* Node.js & npm
* [npm ws](https://www.npmjs.com/package/ws)
* [npm glob](https://www.npmjs.com/package/glob)

Just use ``npm install`` to get everything needed.

Index.html is the controller where you can add, remove, spin, and view the prompts.

Results.html is front-end visual graphics of the wheel including sound and animations.

Server.js is the websocket server which passes along the strings, and also stores them locally. Runs default on port 8080

To start the server run ``node server.js`` or ``npm start``

## Todo & Future features

* Select item via preview list instead of typing id
* Toggles (Mute wheel)
* Import list