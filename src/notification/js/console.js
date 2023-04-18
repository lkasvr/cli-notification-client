function createConsole(template, modalConnection, modalChannel, modalSendNotifications, notificationPanel) {
    const consoler = {
        template,
        modalConnection,
        modalChannel,
        modalSendNotifications,
        notificationPanel,
        sessions: new Map(),
        init: function () {
            const self = this;

            function closeTab(textArea, tab) {
                const i = self.template.find('.li-tab').index(tab);
                const textareaSelectedID = self.template.find("textarea[data-selected='true']").attr('id');
                if (textareaSelectedID === textArea.attr('id')) {
                    const tabPrevious = self.template.find('.li-tab')[i - 1]
                    tabPrevious.click();
                }
                const session = self.sessions.get(textareaSelectedID);
                if (session.ws.isConnected()) session.ws.close();
                textArea.remove();
                tab.remove();
            }

            /* Event Handling Routine - Seleted Tab Session */
            function selectedTextarea() {
                const numId = parseInt(jQuery(this).attr('id').slice(7));
                const oldTextarea = self.template.find("textarea[data-selected='true']");
                const oldSession = self.sessions.get(oldTextarea.attr('id'));
                const currentTextarea = self.template.find(`#textarea-session-${numId}`);
                const currentSession = self.sessions.get(currentTextarea.attr('id'));

                if (oldTextarea) {
                    oldTextarea.attr('data-selected', false)
                    oldTextarea.addClass('hiddenElement');
                    self.notificationPanel.find(`#${oldSession.notificationPanelID}`).addClass('hiddenElement');
                }

                currentTextarea.attr('data-selected', true);
                currentTextarea.removeClass('hiddenElement');
                self.notificationPanel.find(`#${currentSession.notificationPanelID}`).removeClass('hiddenElement');

                toggleConnection();
            }

            /* Event Handling Routine - Add Tab Session */
            function addTab(sessionName) {
                const tabQTY = self.template.find('.li-tab').length;
                const lastLiElement = self.template.find('.li-tab')[tabQTY - 1];
                const numId = parseInt(!lastLiElement ? 0 : lastLiElement.id.slice(7)) + 1;
                const notificationPanelID = `notification-panel-${numId}`;
                sessionName = sessionName ? sessionName : `New Session ${numId}`;

                const li_newTab_id = `li-tab-${numId}`;
                const li_tab = jQuery(`
                <li id="${li_newTab_id}" class="li-tab" data-textareaid="textarea-session-${numId}" title="${sessionName}" role="button">
                    <a href="#">${sessionName}</a>
                    ${!lastLiElement ? '' : `<button id="btn-close-tab-${numId}" type="button" class="btn-close btn-close-white" aria-label="Close" ></button >`}
                </li>
                `);

                const lastTextareaElement = self.template.find('textarea[data-selected="true"]');
                lastTextareaElement.attr('data-selected', false);
                lastTextareaElement.addClass('hiddenElement');

                const lastSession = self.sessions.get(lastTextareaElement.attr('id'));
                if (lastSession) self.notificationPanel.find(`#${lastSession.notificationPanelID}`).addClass('hiddenElement');

                const newTextarea = jQuery(`<textarea id="textarea-session-${numId}" class="textarea consoleSession" data-selected="true" readonly>${sessionName}</textarea>`);

                self.template.find('#add-tab-btn-li').before(li_tab);

                self.template.find(`#btn-close-tab-${numId}`).click(function () { closeTab(newTextarea, li_tab) });
                self.template.find(`#${li_newTab_id}`).click(selectedTextarea);

                self.template.find('.tabs-bar').after(newTextarea);
                const toasts = createToasts(jQuery('#app-toasts'), self.notificationPanel);
                const logger = createLogger(newTextarea, sessionName);
                const ws = createWebSocket(logger, toasts, { notificationPanelID, sessionName });
                self.notificationPanel.append(`<div id="${notificationPanelID}" class="scrollable"></div>`);
                self.sessions.set(newTextarea.attr('id'), { sout: newTextarea, ws: ws, logger: logger, notificationPanelID });
                toggleConnection();
            }

            function connect(textArea, url) {
                const textareaID = textArea.attr('id');
                const ws = self.sessions.get(textareaID).ws;
                ws.connect(url, () => toggleConnection());
            }

            /* Event Handling Routine - Toggle Button Connection */
            function toggleConnection() {
                const session = self.sessions.get(self.template.find('textarea[data-selected="true"]').attr('id'));
                const liConnectBtn = self.template.find("#li-connect-btn");
                const liDisonnectBtn = self.template.find("#li-disconnect-btn");
                const liSubscribeSession = self.template.find('.li-subscribe-session');
                const liUnsubscribeSession = self.template.find('.li-unsubscribe-session');
                const liSendNotificaiton = self.template.find('li-send-notifications');

                if (session.ws.isConnected()) {
                    liConnectBtn.addClass('hiddenElement');
                    liDisonnectBtn.removeClass('hiddenElement');
                    liSubscribeSession.removeClass('hiddenElement');
                    liUnsubscribeSession.removeClass('hiddenElement');
                    liSendNotificaiton.removeClass('hiddenElement');
                } else {
                    liConnectBtn.removeClass('hiddenElement');
                    liDisonnectBtn.addClass('hiddenElement');
                    liSubscribeSession.addClass('hiddenElement');
                    liUnsubscribeSession.addClass('hiddenElement');
                    liSendNotificaiton.addClass('hiddenElement');
                }
            }

            /* Event Handling Routine - Show Alert */
            function callAlert(msg, type = 'primary', delay = 5) {
                const alertComponent = jQuery(`<div class="alert alert-${type}" role="alert"> ${msg}</div>`);
                jQuery('#liveAlertPlaceholder').append(alertComponent);
                setTimeout(() => alertComponent.remove(), delay * 1000)
            }

            // Event Handling Function's
            // Connection Operation's
            self.modalConnection.find('.btn-connection').click(function () {
                const currentTextarea = self.template.find("textarea[data-selected='true']");
                const session = self.sessions.get(currentTextarea.attr('id'));
                if (session.ws.isConnected()) return callAlert('It is only possible to connect if there is no connection.', type = 'warning');

                const url = self.modalConnection.find('#host-name').val();
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

            self.template.find("#li-disconnect-btn").click(function () {
                const session = self.sessions.get(self.template.find("textarea[data-selected='true']").attr('id'));
                if (!session.ws.isConnected()) return callAlert('It is only possible to disconnect if there is a connection.', type = 'warning');
                session.ws.close();
                toggleConnection();
            });
            /****/

            // Subscribe Operation's
            self.template.find('.subscribe-session').click(() => {
                const currentTextarea = self.template.find("textarea[data-selected='true']");
                const session = self.sessions.get(currentTextarea.attr('id'));
                if (!session.ws.isConnected()) return callAlert('It is only allowed to subscribe on some channels when connected.', type = 'warning');
                self.modalChannel.find('.btn-subscribe').removeClass('hiddenElement');
                self.modalChannel.find('.btn-unsubscribe').addClass('hiddenElement');
                self.modalChannel.modal('show');
            });

            self.modalChannel.find('.btn-subscribe').click(function () {
                const channelsText = self.modalChannel.find('.channels').val();
                if (channelsText && channelsText.length > 0) {
                    const currentTextarea = self.template.find("textarea[data-selected='true']");
                    const session = self.sessions.get(currentTextarea.attr('id'));
                    const channels = channelsText.split(',');
                    session.ws.subscribe(channels);
                    self.modalChannel.modal('hide');
                    return;
                }
                callAlert('It is necessary to fill in the description of the channel for subscribing.', 'warning');
            });
            /****/

            // Unsubscribe Operation's
            self.template.find('.unsubscribe-session').click(function () {
                const currentTextarea = self.template.find("textarea[data-selected='true']");
                const session = self.sessions.get(currentTextarea.attr('id'));
                if (!session.ws.isConnected()) return callAlert('It is only allowed to unsubscribe on some channels when connected.', type = 'warning');
                self.modalChannel.find('.btn-subscribe').addClass('hiddenElement');
                self.modalChannel.find('.btn-unsubscribe').removeClass('hiddenElement');
                self.modalChannel.modal('show');
            });

            self.modalChannel.find('.btn-unsubscribe').click(function () {
                const channelsText = self.modalChannel.find('.channels').val();
                if (channelsText && channelsText.length > 0) {
                    const currentTextarea = self.template.find("textarea[data-selected='true']");
                    const session = self.sessions.get(currentTextarea.attr('id'));
                    const channels = channelsText.split(',');
                    session.ws.unsubscribe(channels);
                    return;
                }
                callAlert('It is necessary to fill in the description of the channel for unsubscribing.', 'warning');
            });
            /****/

            // Send Notification Operation's

            self.template.find('.li-send-notifications').click(function () {
                editorResponse.setValue("");
                self.modalSendNotifications.modal('show');
            });

            self.modalSendNotifications.find('.btn-send-notification').click(function () {
                self.modalSendNotifications.find('.send-notification').submit();
            });

            self.modalSendNotifications.find('.send-notification').submit(function (event) {
                event.preventDefault();
                const formData = new FormData(this);
                const validationMsg = self.modalSendNotifications.find('.textarea-validation-msg');
                validationMsg.html('');
                try {
                    const tenantId = formData.get('tenant-id');
                    const data = editor.getValue()
                    editorResponse.setValue("");

                    let headers = {
                        'Content-Type': 'application/json',
                        'Tenant-Id': `'${tenantId}'`
                    }

                    jQuery.ajax({type: 'POST', url: '/notification-api', data: data, headers: headers, success: function (res) {
                            let result = JSON.stringify(res);
                            console.log('success: '+result);
                            editorResponse.setValue(result);
                        },
                        error: function (xhr) {
                            if (xhr) {
                                let result = xhr.status ? xhr.status : '000';
                                result += " - ";
                                result += xhr.statusMessage ? xhr.statusMessage : "";
                                validationMsg.html(result);
                            }

                        }
                    });
                } catch (e) {
                    validationMsg.html(e.message);
                }
                return;
            });
            /****/

            self.template.find('.li-tab').click(selectedTextarea);

            // init() Execution's
            addTab('Main Session');
        }
    };
    consoler.init();
    return consoler;
}