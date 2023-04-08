function createWebSocket(loggerParam, painelParam) {
   let notificationWebSocket = {
      logger: loggerParam,
      painel: painelParam,
      connect: function(address) {
         this.logger.append('info', `websocket.js: Connecting [${address}].`);
      },
      subscrible: function(channel) {
         this.logger.append('info', `websocket.js: Subscribing [${channel}].`);
      },
   };
   return notificationWebSocket;
}