import React from 'react';

import FloorMap from './FloorMap';
import HeaderBar from './HeaderBar';
import ActionBar from './ActionBar';
import GoogleCalendar from './GoogleCalendar';

class App extends React.Component {
    state = {
        actionBarData: null
    };

    handleOpenActionBar = (data) => {
        this.setState({
            actionBarData: data,
        });
    }
    render() {
        return (
            <div>
                <HeaderBar />
                <FloorMap handleOpenActionBar={this.handleOpenActionBar} />
                <ActionBar data={this.state.actionBarData} handleOpenActionBar={this.handleOpenActionBar}/>
                <GoogleCalendar/>
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