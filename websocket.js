function createWebSocket(logger) {
   if (!("WebSocket" in window)) {
      alert("WebSocket NOT supported by your Browser!");
   }
   let notificationWebSocket = {
      logger,
      ws: null,
      connect: function(url) {
         const self = this;
         self.logger.append('info', `websocket.js: Connecting [${url}].`);
         self.ws = new WebSocket(url);
         self.ws.onopen = function() {
            self.logger.append('info', `websocket.js: Connected [${url}].`);
         };
         self.ws.onmessage = function (evt) {
            self.logger.append('info', `websocket.js: received [${evt.data}].`);
         };
      },
      subscrible: function(channel) {
         if (this.ws) {
            this.logger.append('info', `websocket.js: Subscribing [${channel}].`);
            this.ws.send("sjaksjkajs");
            this.logger.append('info', `websocket.js: Subscribed [${channel}].`);
         }
      },

   };
   return notificationWebSocket;
}