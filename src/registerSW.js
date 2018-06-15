let swRegistration;
let isSubscribed;

const applicationServerPublicKey = 'BBUEMlssXaI6x2Js3qf-RTh_sbHMGD_XCh7bSAYSErLagUo0RuJlItCWOw2zFqPrjdKoV2Z38zgdmWnpO2O3xDM';

const BACKEND_HOST = 'http://localhost:8085';
function urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

if ('serviceWorker' in navigator && 'PushManager' in window) {
    navigator.serviceWorker.register('sw.js').then(function (swReg) {
        console.log('Service Worker is registered', swReg);

        swRegistration = swReg;
        initializeUI();
    })
        .catch(function (error) {
            console.error('Service Worker Error', error);
        });
} else {
    console.warn('Push messaging is not supported');

}

function initializeUI() {
    // Set the initial subscription value
    swRegistration.pushManager.getSubscription()
        .then(function (subscription) {
            isSubscribed = !(subscription === null);

            if (isSubscribed) {
                sendSubscriptionToBackend(subscription);
                console.log('User IS subscribed.');
            } else {
                subscribeUser();
                console.log('User is NOT subscribed.');
            }
        });
}

function sendSubscriptionToBackend(subscription) {
    fetch(`${BACKEND_HOST}/saveSubscriptionToBackend`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            subscription
        })
    }).then(res => { 
        console.log('Subscription saved successfully');
    });
}

function subscribeUser() {
    const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
    swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey
    })
        .then(function (subscription) {
            console.log('User is subscribed.', subscription);
            sendSubscriptionToBackend(subscription);
            isSubscribed = true;
        })
        .catch(function (err) {
            console.log('Failed to subscribe the user: ', err);
        });
}