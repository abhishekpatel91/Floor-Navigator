import React from 'react';
import queryString from 'query-string';
import FloorMap from './FloorMap';
import HeaderBar from './HeaderBar';
import ActionBar from './ActionBar';
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

    render() {
        const { pin, page, from, to } = queryString.parse(this.props.location.hash);
        return (
            <div>
                {
                    page === 'direction' ?
                    <NavigationToolbar from={from} to={to} />
                    : null
                }
                <HeaderBar onSearchClick={this.onSearchClickHandler} />
                <FloorMap onMapClick={this.onMapClickHandler}/>
                {
                    page === 'location' ?
                    <ActionBar onClose={this.onCloseHandler} location={pin} />
                    : null
                }
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