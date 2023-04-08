function createNotificationLog(textAreaParam) {

   let log = {
      textArea: textAreaParam,
      append: function(severity, message) {
         debugger
         textArea.text(moment().format('YYYY-MM-DDTHH:mm:ss') + "[" + severity + "]" + message + "\n" + textArea.text())

      }
   };
   return log;
}


function createNotificationWebSocket(logParam, painelParam) {
   let notificationWebSocket = {
      log: logParam,
      painel: painelParam,
      connect: function() {
         log.append("Connecting");

      }
   };
   return notificationWebSocket;
}