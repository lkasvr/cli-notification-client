function createWebSocket(logger, toasts, dataSession) {
   if (!("WebSocket" in window)) alert("WebSocket ISN'T supported by your Browser!");
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
            const self = this;
            const data = JSON.parse(evt.data);
            self.logger.append('info', `websocket.js: received [${data.content}].`);
            if (data.operation !== 'SUBSCRIBING') toasts.globalAppNotify(data, dataSession, self.ws);
            toasts.notificationPanelNotify(data, dataSession, self.ws);
         }
         self.ws.markAsRead = (notification, toast) => {
            const self = this;
            if (self.ws) {
               self.logger.append('info', `websocket.js: marking as read notification ${notification.title}.`);
               self.ws.send(JSON.stringify({operation: 'MARK_AS_READ'}));
               self.logger.append('info', `websocket.js: marked as read notification ${notification.title}.`);
               toast.removeClass('border-primary ').addClass('border-secondary');
               toast.find('.notification-badge').addClass('hiddenElement');
               toast.find('a.btn-mar').addClass('hiddenElement');
               toast.find('a.btn-maur').removeClass('hiddenElement');
            }
         };
         self.ws.markAsUnread = (notification, toast) => {
            const self = this;
            if (self.ws) {
               self.logger.append('info', `websocket.js: marking as unread notification ${notification.title}.`);
               self.ws.send(JSON.stringify({operation: 'MARK_AS_UNREAD'}));
               self.logger.append('info', `websocket.js: marked as unread notification ${notification.title}.`);
               toast.removeClass('border-secondary ').addClass('border-primary');
               toast.find('.notification-badge').removeClass('hiddenElement');
               toast.find('a.btn-maur').addClass('hiddenElement');
               toast.find('a.btn-mar').removeClass('hiddenElement');
            }
         };
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