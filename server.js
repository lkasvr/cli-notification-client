// this is just to demo the concept of SSE, not intended for production usage.

const http = require("http");
const fs = require("fs");
const WebSocket = require('ws');
const moment = require('moment');

const host = "127.0.0.1";
const port = 3080;

// A simple dataSource that changes over time
const requestListener = (request, response) => {
    console.log(`server.js: Enter in requestListener -> ${request.url}`);
  if (request.url == '/' || request.url === '/notification' || request.url === '/notification.html') {
        fs.readFile("notification.html", (error, data) => actionExecute( { error: error, data: data, response: response, contentType: 'text/html'}));
  } else if (request.url === '/modal-channel.html') {
      fs.readFile("modal-subscrible.html", (error, data) => actionExecute( { error: error, data: data, response: response, contentType: 'text/html'}))
  } else if (request.url === '/modal-connection.html') {
        fs.readFile("modal-connection.html", (error, data) => actionExecute( { error: error, data: data, response: response, contentType: 'text/html'}));
  } else if (request.url === '/websocket.js') {
        fs.readFile("websocket.js", (error, data) => actionExecute( { error: error, data: data, response: response, contentType: 'text/javascript'}));
  } else if (request.url === '/console.js') {
        fs.readFile("console.js", (error, data) => actionExecute( { error: error, data: data, response: response, contentType: 'text/javascript'}));
  } else if (request.url === '/logger.js') {
        fs.readFile("logger.js", (error, data) => actionExecute( { error: error, data: data, response: response, contentType: 'text/javascript'}));
  } else if (request.url === '/notification.css') {
        fs.readFile("notification.css", (error, data) => actionExecute( { error: error, data: data, response: response, contentType: 'text/css'}));
  } else {
    console.log(`server.js: The resource ${request.url} does not found`);
        actionExecute({error: `The resource ${request.url} does not exist`, response: response});
  }

};

actionExecute = function (action) {
    let responseCode = action.error ? 404 : 200;
    action.response.writeHead(responseCode, action.contentType);
    if (responseCode == 200) {
        action.response.write(action.data);
    }
    action.response.end(action.error);
};





const server = http.createServer(requestListener);
server.listen(port, host, () => console.log(`server.js: server running at http://${host}:${port}`));