function createWebSocket(logger) {
   if (!("WebSocket" in window)) {
      alert("WebSocket NOT supported by your Browser!");
   }
   let notificationWebSocket = {
      logger,
      ws: null,
      connected: false,
      channels: [],
      connect: function(url) {
         const self = this;
         self.logger.append('info', `websocket.js: Connecting [${url}].`);
         self.ws = new WebSocket(url);
         self.ws.onopen = function() {
            self.logger.append('info', `websocket.js: Connected [${url}].`);
            self.connected = true;
         };
         self.ws.onmessage = function (evt) {
            self.logger.append('info', `websocket.js: received [${evt.data}].`);
         };
      },
      subscrible: function(channels) {
         const self = this;
         if (self.ws) {
            self.logger.append('info', `websocket.js: Subscribing [${channels}].`);
            self.ws.send(JSON.stringify({operation: 'SUBSCRIBING', channels}));
            self.channels.push(channels);
            self.logger.append('info', `websocket.js: Subscribed [${channels}].`);
         }
      },

   };
   return notificationWebSocket;
}