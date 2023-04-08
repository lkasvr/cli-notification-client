function createNotificationLog(txtConsoleParam) {
   let log = {
      txtConsole: txtConsoleParam,
      append: function(severity, message) {
         debugger
         this.txtConsole.text(moment().format('YYYY-MM-DDTHH:mm:ss') + " [" + severity + "] " + message + "\n" + this.txtConsole.text())
      }
   };
   return log;
}


function createNotificationWebSocket(logParam, painelParam) {
   let notificationWebSocket = {
      log: logParam,
      painel: painelParam,
      connect: function(address) {
         log.append('info', `websocket.js: connecting ${address}.`);
      },
      subscrible: function(channel) {
         log.append('info', `websocket.js: Subscribing ${channel}.`);
      },
   };
   return notificationWebSocket;
}