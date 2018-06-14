import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import App from './js/App';
import 'css/index.scss';


const render = () => {
    ReactDOM.render(
        (<BrowserRouter>
            <Switch>
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
