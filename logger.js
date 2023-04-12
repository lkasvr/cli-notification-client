function createLogger(sout, sessionName) {
    let log = {
        sout,
        sessionName,
        append: function(severity, message) {
            this.sout.text(moment().format('YYYY-MM-DDTHH:mm:ss')  + " [" + sessionName + "] [" + severity + "] " + message + "\n" + this.sout.text())
        }
    };
    return log;
}