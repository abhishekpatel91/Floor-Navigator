import React from 'react';
import styled from 'styled-components';
import floorPlan from '../common/floorPlan';

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
    font-size: 13px;
    &:hover {
        background: rgba(0,0,0,0.1);
    }
    &:last-of-type {
        border-bottom: none;
    }
    &.disabled {
        color: #aaa;
        pointer-events: none;
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

    handleEventClick = (id, event) => () => {
        this.props.history.push({
            pathname: '/',
            hash: `page=location&pin=meetingRooms,${id}`,
            state: { event }
        });
    }

    render() {
        const meetingRooms = floorPlan.map.meetingRooms;
        return (
            !this.state.eventsData.length ?
            <NoData>No Data Available</NoData> :
            <ListItemGroup>
                <GroupHeader>Events</GroupHeader>
                {this.state.eventsData.map((event) => {
                    const location = event.location && (event.location).toLowerCase();
                    const meetingRoom = location && meetingRooms.find((room) => 
                        location.indexOf((room.name).toLowerCase()) > -1
                    );
                    return (
                        <ListItem
                            key={event.id}
                            className={meetingRoom ? '' : 'disabled'}
                            onClick={this.handleEventClick(meetingRoom && meetingRoom.id, event)}
                        >
                            {event.summary}
                            &nbsp;
                            <SmallText>{`on ${this.formatDate(event.start.dateTime)}`}</SmallText>
                        </ListItem>
                    );
                })}
            </ListItemGroup>
        );
    }
}
