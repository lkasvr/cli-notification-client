// this is just to demo the concept of SSE, not intended for production usage.

const http = require("http");
var fs = require("fs");
const WebSocket = require('ws');

const host = "127.0.0.1";
const port = 3080;

// A simple dataSource that changes over time
const requestListener = function (request, response) {
  debugger
  console.log(`server.js: Enter in requestListener -> ${request.url}`);
  if (request.url === '/notification' || request.url === '/notification.html') {
    console.log(`server.js: The request.url is ${request.url}`);
        fs.readFile("notification.html", function(error, data) {
            if (error) {    
                console.log(`server.js: An error occur ${error}`);
                response.writeHead(404);
                response.write(error);
                response.end();
            } else {
                console.log(`server.js: The HTML was loaded ${data}`);
                response.writeHead(200, { 'Content-Type': 'text/html' });
                response.write(data);
                response.end();
            }
        });
  } else if (request.url === '/websocket.js') {
        fs.readFile("websocket.js", function(error, data) {
            if (error) {    
                console.log(`server.js: An error occur ${error}`);
                response.writeHead(404);
                response.write(error);
                response.end();
            } else {
                console.log(`server.js: The HTML was loaded ${data}`);
                response.writeHead(200, { 'Content-Type': 'text/javascript' });
                response.write(data);
                response.end();
            }
        });
        
  } else if (request.url === '/console.css') {
    debugger
    fs.readFile("console.css", function(error, data) {
        if (error) {    
            console.log(`server.js: An error occur ${error}`);
            response.writeHead(404);
            response.write(error);
            response.end();
        } else {
            console.log(`server.js: The HTML was loaded ${data}`);
            response.writeHead(200, { 'Content-Type': 'text/css' });
            response.write(data);
            response.end();
        }
    });
  } else {
    console.log(`server.js: The resource ${request.url} does not found`);
    response.statusCode = 404;
    response.end(`The resource ${request.url} does not exist`);
  }

};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
  console.log(`server.js: server running at http://${host}:${port}`);
});