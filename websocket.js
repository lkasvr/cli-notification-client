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
   debugger;
   let notificationWebSocket = {
      log: logParam,
      painel: painelParam,
      connect: function(address) {
         this.log.append('info', `websocket.js: Connecting [${address}].`);
      },
      subscrible: function(channel) {
         this.log.append('info', `websocket.js: Subscribing [${channel}].`);
      },
   };
   return notificationWebSocket;
}