import React from 'react';
import queryString from 'query-string';
import FloorMap from './FloorMap';
import HeaderBar from './HeaderBar';
import ActionBar from './ActionBar';
import GoogleCalendar from './GoogleCalendar';
import NavigationToolbar from './NavigationToolbar';

class App extends React.Component {
    onMapClickHandler = (type, id) => {
        this.props.history.push(`/#page=location&pin=${type},${id}`);
    }

    onSearchClickHandler = () => {
        this.props.history.push(`/search`);
    }

    onCloseHandler = () => {
        this.props.history.push(`/`);
    }

    openDirections = (from, to) => {
        this.props.history.push(`/#page=direction&from=${from}&to=${to}`);
    }

    goBack = () => {
        this.props.history.goBack();
    }

    render() {
        const { pin, page, from, to } = queryString.parse(this.props.location.hash);
        return (
            <div>
                <NavigationToolbar page={page} from={from} to={to} goBack={this.goBack} />
                <HeaderBar onSearchClick={this.onSearchClickHandler} />
                <FloorMap onMapClick={this.onMapClickHandler} />
                {
                    page === 'location' ?
                        <ActionBar
                            onClose={this.onCloseHandler}
                            location={pin}
                            openDirections={this.openDirections}
                        />
                        : null
                }
                <GoogleCalendar />
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