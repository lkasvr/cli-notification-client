function createConsole(templateParam) {
    let consoler = {
        template: templateParam,
        init: function() {
            const self = this;

            /* Event Handling Routine - Close Tab Session */
            function closeTab(tabId, textareaNumId) {
                const selectedTextarea = self.template.find("textarea[data-selected='true']");
                self.template.find(`#${tabId}`).remove();
                self.template.find(`#textarea-session-${textareaNumId}`).remove();
                if (selectedTextarea.attr('id') === `textarea-session-${textareaNumId}`) {
                    const tabQTY = self.template.find('.li-tab').length;
                    const currentTextarea = self.template.find(`#textarea-session-${tabQTY < 3 ? 1 : textareaNumId - 1}`);
                    currentTextarea.removeClass('hiddenTextarea');
                    currentTextarea.attr('data-selected', true);
                }
            }

            /* Event Handling Routine - Seleted Tab Session */
            function selectedTextarea() {
                const numId = parseInt(jQuery(this).attr('id').slice(7));
                const oldTextarea = self.template.find("textarea[data-selected='true']");
                const currentTextarea = self.template.find(`#textarea-session-${numId}`);
                oldTextarea.attr('data-selected', false)
                currentTextarea.attr('data-selected', true);
                oldTextarea.addClass('hiddenTextarea');
                currentTextarea.removeClass('hiddenTextarea');
            }

            /* Event Handling Routine - Add Tab Session */
            const addTab = () => {
                const tabQTY = self.template.find('.li-tab').length;
                if (tabQTY < 10) {
                    let sessionName = prompt('Forneça um nome a sua nova sessão:');
                    const lastLiElement = self.template.find('.li-tab')[tabQTY - 1];
                    const numId = parseInt(lastLiElement.id.slice(7)) + 1;

                    const li_newTab_id = `li-tab-${numId}`;
                    const li_tab = jQuery(`
                    <li id="${li_newTab_id}" class="li-tab" data-textareaid="textarea-session-${numId}">
                        <a href="#">${!sessionName ? `New Session ${numId}` : sessionName}</a>
                        <button id="btn-close-tab-${numId}" type="button" class="btn-close btn-close-white" aria - label="Close" ></button >
                    </li>
                    `);

                    const lastTextareaElement = self.template.find(`#${self.template.find('.consoleSession')[0].getAttribute('id')}`);
                    lastTextareaElement.attr('data-selected', false);
                    lastTextareaElement.addClass('hiddenTextarea');

                    const newTextarea = jQuery(`<textarea id="textarea-session-${numId}" class="textarea consoleSession" data-selected="true" readonly>${!sessionName ? `New Session ${numId} Begin` : `Session ${sessionName} Begin`}</textarea>`);

                    self.template.find(`#${lastLiElement.id}`).after(li_tab);
                    self.template.find(`#btn-close-tab-${numId}`).click(function () { closeTab(li_newTab_id, numId) });
                    self.template.find(`#${li_newTab_id}`).click(selectedTextarea);

                    self.template.find('.tabs-bar').after(newTextarea);
                }
            }

            // Event Handling Function's
            self.template.find('.add-tab-btn-li').click(() => addTab());
            self.template.find('.li-tab').click(selectedTextarea);
        }
    };
    consoler.init();
    return consoler;
}