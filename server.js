// this is just to demo the concept of SSE, not intended for production usage.

const http = require("http");
const fs = require("fs");
const path = require('path');
const WebSocket = require('ws');
const moment = require('moment');

const host = "127.0.0.1";
const port = 3080;

// A simple dataSource that changes over time
const requestListener = (request, response) => {
    const filePath = getFilePath(request.url);
    const contentType = getContentType(filePath);

    fs.readFile(filePath, function(error, content) {
        if (error) {
            if(error.code == 'ENOENT'){
                fs.readFile('./404.html', function(error, content) {
                    response.writeHead(200, { 'Content-Type': contentType });
                    response.end(content, 'utf-8');
                });
            }
            else {
                response.writeHead(500);
                response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
                response.end();
            }
        }
        else {
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(content, 'utf-8');
        }
    });
};

getFilePath = function (url) {
    const filePath = '.' + url;
    if (filePath == './')
       return './notification.html';
    return filePath;
}

getContentType = function (filePath) {
    const extname = path.extname(filePath);
    let contentType = 'text/html';
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
            contentType = 'image/jpg';
            break;
        case '.wav':
            contentType = 'audio/wav';
            break;
    }
    return contentType;
}

const server = http.createServer(requestListener);
server.listen(port, host, () => console.log(`server.js: server running at http://${host}:${port}`));