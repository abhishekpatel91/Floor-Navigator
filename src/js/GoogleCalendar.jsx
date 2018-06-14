import React from 'react';

// Client ID and API key from the Developer Console
const CLIENT_ID = '314766599120-rcmbs6kb45mt5n65t8d4v6e3kuqjdi0r.apps.googleusercontent.com';
const API_KEY = 'AIzaSyDUqtg-h12RtRTE1qJBP2xIoYqxgE7CVFg';

// Array of API discovery doc URLs for APIs used by the quickstart
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

export default class GoogleCalendar extends React.PureComponent {
    componentDidMount() {
        this.handleClientLoad();
    }

    handleClientLoad = () => {
        gapi.load('client:auth2', this.initClient);
    }

    initClient = () => {
        gapi.client.init({
            apiKey: API_KEY,
            clientId: CLIENT_ID,
            discoveryDocs: DISCOVERY_DOCS,
            scope: SCOPES
        }).then(() => {
            gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSigninStatus);
            this.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get())
        });
    }

    updateSigninStatus = (isSignedIn) => {
        if (isSignedIn) {
            console.log('Signed in!');
            this.listUpcomingEvents()
        } else {
            console.log('Not signed in!');
            gapi.auth2.getAuthInstance().signIn();
        }
    }

    listUpcomingEvents() {
        gapi.client.calendar.events.list({
            'calendarId': 'primary',
            'timeMin': (new Date()).toISOString(),
            'showDeleted': false,
            'singleEvents': true,
            'maxResults': 10,
            'orderBy': 'startTime'
        })
        .then((response) => {
            var events = response.result.items;
            console.log(events);
        });
    }

    render() {
        return null;
    }
}