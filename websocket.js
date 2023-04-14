function createWebSocket(logger, toasts, dataSession) {
   if (!("WebSocket" in window)) alert("WebSocket NOT supported by your Browser!");
   let notificationWebSocket = {
      logger,
      toasts,
      dataSession,
      ws: null,
      connected: false,
      channels: [],
      connect: function(url, callbackOpen, callbackMsg) {
         const self = this;
         self.logger.append('info', `websocket.js: Connecting [${url}].`);
         self.ws = new WebSocket(url);
         self.ws.onopen = function() {
            self.logger.append('info', `websocket.js: Connected [${url}].`);
            self.connected = true;
            callbackOpen();
         };
         self.ws.onmessage = (evt) => {
            const data = JSON.parse(evt.data);
            self.logger.append('info', `websocket.js: received [${data.content}].`);
            if (data.operation !== 'SUBSCRIBING') {
               toasts.globalAppNotify(data, dataSession);
            }
            toasts.notificationPanelNotify(data, dataSession);
         }
      },
      subscribe: function(channels) {
         const self = this;
         if (self.ws) {
            self.logger.append('info', `websocket.js: Subscribing [${channels}].`);
            self.ws.send(JSON.stringify({operation: 'SUBSCRIBING', channels}));
            self.channels.push(channels);
            self.logger.append('info', `websocket.js: Subscribed [${channels}].`);
         }
      },
      unsubscribe: function (channels) {
         const self = this;
         if (self.ws) {
            self.logger.append('info', `websocket.js: unsubscribing [${channels}].`);
            self.ws.send(JSON.stringify({operation: 'UNSUBSCRIBING', channels}));
            self.channels.push(channels); // remover do array
            self.logger.append('info', `websocket.js: unsubscribed [${channels}].`);
         }
      },
      close: function () {
         const self = this;
         self.ws.close();
         self.connected = false;
         self.logger.append('info', `websocket.js: Disconnecting.`);
         self.logger.append('info', `websocket.js: Disconnect.`);
      },
      isConnected: function () {
         const self = this;
         return self.connected;
      }
   };
   return notificationWebSocket;
}