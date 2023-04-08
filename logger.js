function createLogger(textArea) {
    let log = {
        txtConsole: textArea,
        append: function(severity, message) {
            this.txtConsole.text(moment().format('YYYY-MM-DDTHH:mm:ss') + " [" + severity + "] " + message + "\n" + this.txtConsole.text())
        }
    };
    return log;
}