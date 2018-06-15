import React from 'react';
import styled from 'styled-components';

const NoData = styled.div`
    display: flex;
    width: 100%;
    padding: 20px;
    align-items: center;
    justify-content: center;
`;

const ListItemGroup = styled.section`
    box-shadow: 0px 2px 12px rgba(0,0,0,0.2);
    margin: 10px;
`;

const GroupHeader = styled.section`
    font-size: 18px;
    padding: 20px;
`;

const ListItem = styled.section`
    padding: 20px 20px;
    border-bottom: 1px solid #e9e9e9;
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: 0.3s;
    font-size: 14px;
    &:hover {
        background: rgba(0,0,0,0.1);
    }
    &:last-of-type {
        border-bottom: none;
    }
`;

const SmallText = styled.span`
    font-size: 12px;
`;

export default class Events extends React.PureComponent {
    constructor() {
        super();
        this.state = {
            isSignedIn: gapi && gapi.auth2.getAuthInstance().isSignedIn.get(),
            eventsData: []
        };
    }

    componentDidMount() {
        if (this.state.isSignedIn) {
            this.listUpcomingEvents();
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
            this.setState({ eventsData: events });
        });
    }

    formatDate(d) {
        return (new Date(d)).toLocaleDateString();
    }

    render() {
        return (
            !this.state.eventsData.length ?
            <NoData>No Data Available</NoData> :
            <ListItemGroup>
                <GroupHeader>Events</GroupHeader>
                {this.state.eventsData.map((event) => (
                    <ListItem key={event.id}>
                        {event.summary}
                        &nbsp;
                        <SmallText>{`on ${this.formatDate(event.start.dateTime)}`}</SmallText>
                    </ListItem>
                ))}
            </ListItemGroup>
        );
    }
}
