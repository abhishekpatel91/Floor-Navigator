import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import App from './js/App';
import Search from './js/Search';
import 'css/index.scss';
import './registerSW';

const render = () => {
    ReactDOM.render(
        (<BrowserRouter>
            <Switch>
                <Route path="/search" component={Search} />
                <Route path="/" component={App} />
            </Switch>
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
