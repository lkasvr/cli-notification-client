function createConsole(template, modal) {
    let consoler = {
        template,
        modal,
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
                debugger
                const numId = textArea.attr('id').slice(17);
                const sessionName = self.template.find(`#li-tab-${numId}>a`).html()

                const logger = createLogger(textArea, sessionName);
                const ws = createWebSocket(logger);
                ws.connect(url);

                self.sessions.set(textArea.attr('id'), { sout: textArea, ws: ws, logger: logger });
            }

            // Event Handling Function's
            modal.find('.btn-connection').click(function () {
                const url = modal.find('#host-name').val();
                modal.modal('toggle'); // close modal

                connect(self.template.find('textarea[data-selected="true"]'), url);
            });

            modal.find('.btn-new-connection').click(function () {
                const url = modal.find('#host-name').val();
                const sessionName = self.modal.find('#session-name-input').val();
                modal.modal('toggle'); // close modal
                addTab(sessionName);
                connect(self.template.find('textarea[data-selected="true"]'), url);
            });

            self.template.find('.new-session').click(function () {
                modal.find('.btn-connection').hide();
                modal.find('.btn-new-connection').show();
                modal.modal('toggle');
            });

            self.template.find('.current-session').click(function () {
                modal.find('.btn-connection').show();
                modal.find('.btn-new-connection').hide();
                modal.modal('toggle');
            });

            self.template.find('.li-tab').click(selectedTextarea);

        }
    };
    consoler.init();
    return consoler;
}