function createToasts(appToasts, notificationPanel) {
   const notificatiOnToasts = {
      appToasts,
      notificationPanel,
      connected: false,
      toastsByTabs: [],
      globalAppNotify: function (data, {sessionName}) {
         const self = this;
         const newGlobalToast = jQuery(`
           <div id="${data.id}" class="toast call-toast bg-secondary-subtle" role="alert" aria-live="assertive" aria-atomic="true" data-bs-autohide="false">
             <div class="toast-header  bg-secondary-subtle">
               <img src="..." class="rounded me-2" alt="...">
               <strong class="me-auto">${sessionName + ' ' + data.title}</strong>
               <small>11 mins ago</small>
               <button type="button" class="btn-close btn-close-global-toast" data-bs-dismiss="toast" aria-label="Close"></button>
             </div>
             <div class="toast-body">
               ${data.content}
               <div class="mt-2 pt-2 border-top">
                 <button type="button" class="btn btn-primary btn-sm">Take action</button>
                 <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="toast">Close</button>
               </div>
             </div>
           </div>`);
         self.appToasts.prepend(newGlobalToast);
         self.appToasts.find(`#${data.id}`).toast("show");
      },
      notificationPanelNotify: function (data, {notificationPanelID}) {
         const self = this;
         const newNotificationToasts = jQuery(`
           <div id="${data.id}" class="toast notification-toast mb-3" role="alert" aria-live="assertive" aria-atomic="true" data-bs-autohide="false" animation>
             <div class="toast-header">
               <img src="..." class="rounded me-2" alt="...">
               <strong class="me-auto">${data.title}</strong>
               <small>11 mins ago</small>
               <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
             </div>
             <div class="toast-body">
               ${data.content}
             </div>
           </div>
         `);
         self.notificationPanel.find(`#${notificationPanelID}`).prepend(newNotificationToasts);
         self.notificationPanel.find(`#${data.id}`).toast("show");
      }
   };
   return notificatiOnToasts;
}