import React from 'react';

import FloorMap from './FloorMap';
import HeaderBar from './HeaderBar';
import ActionBar from './ActionBar';

class App extends React.Component {
    render() {
        return (
            <div>
                <HeaderBar />
                <FloorMap />
                <ActionBar />
            </div>
        );
    }
}

/* Applying the react hot loader conditionally on dev env only */
let defaultExport = App;

if (__DEV__) {
    const { hot } = require('react-hot-loader');
    defaultExport = hot(module)(App);
}

export default defaultExport;