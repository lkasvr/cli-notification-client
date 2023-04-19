function createToasts(appToasts, notificationPanel) {
   const notificatiOnToasts = {
      appToasts,
      notificationPanel,
      connected: false,
      toastsByTabs: [],
      globalAppNotify: function (data, {sessionName}, ws) {
         const self = this;
         const newGlobalToast = jQuery(`
           <div id="${data.id}" class="toast call-toast bg-secondary-subtle border border-primary border-2" role="alert" aria-live="assertive" aria-atomic="true" data-bs-autohide="false">
             <div class="toast-header bg-secondary-subtle position-relative">
             <span class="position-absolute top-0 start-100 translate-middle p-2 bg-primary border border-light rounded-circle notification-badge">
               <span class="visually-hidden">New alerts</span>
             </span>
               <img src="..." class="rounded me-2" alt="...">
               <strong class="me-auto">${sessionName + ' ' + data.title}</strong>
               <small>11 mins ago</small>
               <button type="button" class="btn-close btn-close-global-toast" data-bs-dismiss="toast" aria-label="Close"></button>
             </div>
             <div class="toast-body">
               ${data.content}
               <div class="mt-2 pt-2 border-top">
                 <a class="btn-mar link-primary link-offset-2 link-opacity-75" href="#">Mark as read</a>
                 <a class="btn-maur link-secondary link-offset-2 link-opacity-75 hiddenElement" href="#">Mark as unread</a>
                 <a class="link-secondary link-offset-2 link-opacity-50 ms-2" href="#" data-bs-dismiss="toast">Close</a>
               </div>
             </div>
           </div>`);
        self.appToasts.prepend(newGlobalToast);
        self.appToasts.find(`#${data.id}`).toast("show");
        newGlobalToast.find('.btn-mar').click(function () { ws.markAsRead(data, newGlobalToast) });
        newGlobalToast.find('.btn-maur').click(function () { ws.markAsUnread(data, newGlobalToast) });
      },
      notificationPanelNotify: function (data, {notificationPanelID}, ws) {
         const self = this;
         const newNotificationToasts = jQuery(`
           <div id="${data.id}" class="toast notification-toast border border-primary border-2 mb-3 fade show"" role="alert" aria-live="assertive" aria-atomic="true" data-bs-autohide="false" animation>
             <div class="toast-header">
               <img src="..." class="rounded me-2" alt="...">
               <strong class="me-auto">${data.title}</strong>
               <small>11 mins ago</small>
               <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
             </div>
             <div class="toast-body">
               ${data.content}
               <div class="mt-2 pt-2 border-top">
                 <a class="btn-mar link-primary link-offset-2 link-opacity-75" href="#">Mark as read</a>
                 <a class="btn-maur link-secondary link-offset-2 link-opacity-75 hiddenElement" href="#">Mark as unread</a>
                 <a class="link-secondary link-offset-2 link-opacity-50 ms-2" href="#" data-bs-dismiss="toast">Close</a>
               </div>
             </div>
           </div>
         `);
         self.notificationPanel.find(`#${notificationPanelID}`).prepend(newNotificationToasts);
        self.notificationPanel.find(`#${data.id}`).toast("show");
        newNotificationToasts.find('.btn-mar').click(function () { ws.markAsRead(data, newNotificationToasts) });
        newNotificationToasts.find('.btn-maur').click(function () { ws.markAsUnread(data, newNotificationToasts) });
      }
   };
   return notificatiOnToasts;
}