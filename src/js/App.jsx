import React from 'react';

import FloorMap from './FloorMap';

class App extends React.Component {
    render() {
        return (
            <FloorMap />
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