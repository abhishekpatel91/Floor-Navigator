import React from 'react';
import queryString from 'query-string';
import FloorMap from './FloorMap';
import HeaderBar from './HeaderBar';
import ActionBar from './ActionBar';
import GoogleCalendar from './GoogleCalendar';
import Search from './Search';
import NavigationToolbar from './NavigationToolbar';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchOpen: false
        }
    }
    navigateToPin = (type, id) => {
        this.props.history.push(`/#page=location&pin=${type},${id}`);
    }

    toggleSearch = () => {
        this.setState(state => ({searchOpen: !state.searchOpen}));
    }

    onCloseHandler = () => {
        this.props.history.push(`/`);
    }

    openDirections = (from, to) => {
        this.props.history.push(`/#page=direction&from=${from || 'areas,lift1'}&to=${to}`);
    }

    goBack = () => {
        this.props.history.goBack();
    }

    render() {
        const { pin, page, from, to } = queryString.parse(this.props.location.hash);
        return (
            <div>
                <NavigationToolbar page={page} from={from} to={to} onDirectionsChange={this.openDirections} goBack={this.goBack} />
                <HeaderBar onSearchClick={this.toggleSearch} />

                {
                    this.state.searchOpen ?
                        <Search onItemSelect={this.navigateToPin} onClose={this.toggleSearch} />
                        : null
                }
                <FloorMap onMapClick={this.navigateToPin}/>
                {
                    page === 'location' ?
                        <ActionBar
                            onClose={this.onCloseHandler}
                            location={pin}
                            openDirections={this.openDirections}
                        />
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