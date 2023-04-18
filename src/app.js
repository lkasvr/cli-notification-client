const notification = {
    api: {
        protocol: process.env.NOTIFICATION_API_PROTOCOL || 'http',
        host: process.env.NOTIFICATION_API_HOST || 'localhost',
        port: process.env.NOTIFICATION_API_PORT || 8081,
        path: process.env.NOTIFICATION_API_PATH || '/notification'
    }
}

const express = require('express');
const path = require('path');
const app = express();
const http = require(notification.api.protocol);

const protocol = process.env.PROTOCOL || 'http';
const host = process.env.HOST || '127.0.0.1';
const port = process.env.PORT || 3080;

app.use(express.json());

app.get('*',(request, response) => {
    console.log(`get request get -> ${request.url}`)
    let filePath = '.' + request.url;
    if (filePath === './' || filePath === './app.js')
        filePath = './notification/html/notification.html';
    response.sendFile(path.join(__dirname, filePath));
});

app.post('/notification-api', (request, response) => {

    const data = JSON.stringify(request.body);
    const headers = {
        'Content-Type': 'application/json',
        'api-version': '1.0.0',
        'Tenant-Id': 'HSL',
        'Content-Length': data.length,
        'Host': notification.api.host
    }
    const options = {
        hostname: notification.api.host,
        port: notification.api.port,
        path: notification.api.path,
        method: 'POST',
        headers: headers,
        data: data
    }

    let flag = false;
    let req = http.request(options, res => {
        console.log('Status: ' + res.statusCode);
        console.log('Headers: ' + JSON.stringify(res.headers));
        response.status(res.statusCode);

        res.on('data', chunk => {+
            console.log('Body: ' + chunk);
            response.status(res.statusCode)
            response.send(JSON.parse(""+chunk));
            flag = true;
        });

        res.on('end', () => {
            console.log('Response ended: ');
            if (!flag) response.send("");;
        });
    }).on('error', err => {
        console.log('Error: ', err.message);
        response.status(500).send(JSON.stringify(err));
    });

    req.write(data);
    req.end();
});

console.log(`listen -> ${protocol}://${host}:${port}`)
console.log(`notification-api -> ${notification.api.protocol}://${notification.api.host}:${notification.api.port}${notification.api.path}`);
app.listen(port)