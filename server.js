const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const webpush = require('web-push');

const app = express();

app.use(morgan('tiny'));
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

const vapidKeys = {
    publicKey: 'BBUEMlssXaI6x2Js3qf-RTh_sbHMGD_XCh7bSAYSErLagUo0RuJlItCWOw2zFqPrjdKoV2Z38zgdmWnpO2O3xDM',
    privateKey: '4WjOd6Va-yk7grDb-_orNLw0Wqp28Y313cIcUaR-_Xg'
};

webpush.setVapidDetails(
    'mailto:paramsinghvc@gmail.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);
let subscription;
app.get('/', (req, res) => res.send('Welcome to Apis'));
app.use(express.static('../dist'));
app.post('/saveSubscriptionToBackend', (req, res) => {
    subscription = req.body.subscription;
    console.log(req.body);
    res.send({ success: true });
})
app.post('/push', (req, res) => {
    // const subscription = { "endpoint": "https://fcm.googleapis.com/fcm/send/cHM5VVMKJx8:APA91bGh87QyUwJ45KcSHVZcO9F2fjnNgPIdpmdaITE68rv7Zz2frrHqQSyMNU_BB6916wnqqbtTeIF-q1Hj9w_E6ovecllB4FCj-HtPr-hx37NYPhDZzZ9tJtvFpDRrWM6v8P1XdbI6", "expirationTime": null, "keys": { "p256dh": "BDSDKU_PEatC6hwKgy0Ps-KRvtRp2GPHxWZNN9yrxhwrfbdRAjpNCv4vPKBGC0BqWc6ICncfM9zw7wcFLZH6x5o", "auth": "Mu2sz4V5WETzEONisA8I-g" } };
    const { type, id } = req.body;
    const notification = JSON.stringify({
        title: 'Kamikaze Broadcast',
        body: `Please come to ${type}: ${id}`,
    });
    webpush.sendNotification(subscription, notification)
        .catch(err => {
            console.log(err);
        });
    res.send({ success: true });
})

const PORT = process.env.PORT || '8085';

app.listen(PORT, () => {
    console.log(`\n\n\n🚀  Node Server running at http://localhost:${PORT}.\n\n\n`);
})