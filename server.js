const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const webpush = require('web-push');
const path = require('path');

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

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

let subscription;

app.use(express.static(__dirname + '/dist'));
app.use('/lib', express.static(__dirname + '/lib'));

app.get('*', function (request, response) {
    response.sendFile(path.resolve(__dirname, './dist/index.html'));
});

app.post('/saveSubscriptionToBackend', (req, res) => {
    subscription = req.body.subscription;
    console.log(req.body);
    res.send({ success: true });
})
app.post('/push', (req, res) => {
    const { type, id } = req.body;
    const notification = JSON.stringify({
        title: 'Kamikaze Broadcast',
        body: `Please come to ${type}: ${id}`,
        type: type,
        id: id
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