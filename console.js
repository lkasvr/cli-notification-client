function createConsole(template, modalConnection, modalSubscrible) {
    let consoler = {

        template,
        modalConnection,
        modalSubscrible,
        sessions: new Map(),

        init: function() {
            const self = this;

            function closeTab(textArea, tab) {
                const i = self.template.find('.li-tab').index(tab);
                if (self.template.find("textarea[data-selected='true']").attr('id') === textArea.attr('id')) {
                    const tabPrevious = self.template.find('.li-tab')[i-1]
                    tabPrevious.click();
                }
                textArea.remove();
                tab.remove();
            }

            /* Event Handling Routine - Seleted Tab Session */
            function selectedTextarea() {
                const numId = parseInt(jQuery(this).attr('id').slice(7));
                const oldTextarea = self.template.find("textarea[data-selected='true']");
                const currentTextarea = self.template.find(`#textarea-session-${numId}`);

                if (oldTextarea) {
                    oldTextarea.attr('data-selected', false)
                    oldTextarea.addClass('hiddenTextarea');
                }

                currentTextarea.attr('data-selected', true);
                currentTextarea.removeClass('hiddenTextarea');
            }

            /* Event Handling Routine - Add Tab Session */
            function addTab(sessionName) {
                const tabQTY = self.template.find('.li-tab').length;
                const lastLiElement = self.template.find('.li-tab')[tabQTY - 1];
                const numId = parseInt(lastLiElement.id.slice(7)) + 1;

                const li_newTab_id = `li-tab-${numId}`;
                const li_tab = jQuery(`
                <li id="${li_newTab_id}" class="li-tab" data-textareaid="textarea-session-${numId}" title="${!sessionName ? `New Session ${numId}.` : `Session ${sessionName}.`}">
                    <a href="#">${!sessionName ? `New Session ${numId}` : sessionName}</a>
                    <button id="btn-close-tab-${numId}" type="button" class="btn-close btn-close-white" aria-label="Close" ></button >
                </li>
                `);

                const lastTextareaElement = self.template.find(`#${self.template.find('.consoleSession')[0].getAttribute('id')}`);
                lastTextareaElement.attr('data-selected', false);
                lastTextareaElement.addClass('hiddenTextarea');

                const newTextarea = jQuery(`<textarea id="textarea-session-${numId}" class="textarea consoleSession" data-selected="true" readonly>${!sessionName ? `New Session ${numId}.` : `Session ${sessionName}.`}</textarea>`);

                self.template.find(`#${lastLiElement.id}`).after(li_tab);
                self.template.find(`#btn-close-tab-${numId}`).click(function () { closeTab(newTextarea, li_tab) });
                self.template.find(`#${li_newTab_id}`).click(selectedTextarea);

                self.template.find('.tabs-bar').after(newTextarea);
            }

            function connect(textArea, url) {
                const numId = textArea.attr('id').slice(17);
                const sessionName = self.template.find(`#li-tab-${numId}>a`).html()

                const logger = createLogger(textArea, sessionName);
                const ws = createWebSocket(logger);
                ws.connect(url);

                self.sessions.set(textArea.attr('id'), { sout: textArea, ws: ws, logger: logger });
            }

            // Event Handling Function's
            self.modalConnection.find('.btn-connection').click(function () {
                const url =  self.modalConnection.find('#host-name').val();
                self.modalConnection.modal('hide');
                connect(self.template.find('textarea[data-selected="true"]'), url);
            });

            self.modalConnection.find('.btn-new-connection').click(function () {
                const url = self.modalConnection.find('#host-name').val();
                const sessionName = self.modalConnection.find('#session-name-input').val();
                self.modalConnection.modal('hide');
                addTab(sessionName);
                connect(self.template.find('textarea[data-selected="true"]'), url);
            });

            self.template.find('.new-session').click(function () {
                self.modalConnection.find('.btn-connection').hide();
                self.modalConnection.find('.btn-new-connection').show();
                self.modalConnection.modal('show');
            });

            self.template.find('.current-session').click(function () {
                self.modalConnection.find('.btn-connection').show();
                self.modalConnection.find('.btn-new-connection').hide();
                self.modalConnection.modal('show');
            });

            self.template.find('.subscrible-session').click(function () {
                self.modalSubscrible.modal('show');
            });

            self.modalSubscrible.find('.btn-subscribe').click(function () {
                const channelsText =  self.modalSubscrible.find('.channels').val();

                if (channelsText &&  channelsText.length > 0) {
                    const textAreaCurrent = self.template.find("textarea[data-selected='true']");
                    const session = self.sessions.get(textAreaCurrent.attr('id'));
                    const channels = channelsText.split(',');
                    session.ws.subscrible(channels);
                }

            });

            self.template.find('.li-tab').click(selectedTextarea);

        }
    };
    consoler.init();
    return consoler;
}