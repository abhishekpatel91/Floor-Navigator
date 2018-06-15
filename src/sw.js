self.addEventListener('push', function (event) {
    console.log('[Service Worker] Push Received.');
    console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

    const data = JSON.parse(event.data.text());
    const title = data.title;
    const options = {
        body: data.body,
        icon: 'images/icon.png',
        badge: 'images/badge.png'
    };

    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function (event) {
    console.log('[Service Worker] Notification click Received.');

    event.notification.close();

    // clients.matchAll().then(function (clis) {
    //     var client = clis.find(function (c) {
    //         c.visibilityState === 'visible';
    //     });
    //     if (client !== undefined) {
    //         client.navigate('http://localhost:8083/#page=direction&from=undefined&to=workStations,180');
    //         client.focus();
    //     } else {
    //         // there are no visible windows. Open one.
    //         event.waitUntil(clients.openWindow('http://localhost:8083/#page=direction&from=undefined&to=workStations,180'));
    //         event.notification.close();
    //     }
    // });
    event.waitUntil(
        clients.openWindow('http://localhost:8083/#page=direction&from=undefined&to=workStations,180')
    );
});