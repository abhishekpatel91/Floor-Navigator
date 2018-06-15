import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import App from './js/App';
import Search from './js/Search';
import Events from './js/Events';
import GoogleCalendar from './js/GoogleCalendar';

import 'css/index.scss';
import './registerSW';

const render = () => {
    ReactDOM.render(
        (<BrowserRouter>
            <div>
                <GoogleCalendar/>
                <Switch>
                    <Route path="/events" component={Events} />
                    <Route path="/" component={App} />
                </Switch>
            </div>
        </BrowserRouter>
        ),
        document.getElementById('app')
    );
}

const enableDevTools = () => {
    if (__DEV__) {
        const { whyDidYouUpdate } = require('why-did-you-update');
        whyDidYouUpdate(React);
    }
}

enableDevTools();
render();
