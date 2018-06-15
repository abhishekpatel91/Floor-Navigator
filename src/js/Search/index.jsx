import React from 'react';
import styled from 'styled-components';
import { VelocityComponent } from 'velocity-react';

import config from '../common/config';
import floorPlan from '../common/floorPlan';

const MAX_RECENT_SEARCHES = 5;

const Holder = styled.section`
    position: fixed;
    z-index: 10;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    overflow: auto;
    background: white;
`;

const SearchInput = styled.input`
    background: white;    
    margin: 10px;
    margin-bottom: 0;
    box-sizing: border-box;
    padding: 12px 16px;
    border-radius: 3px;
    box-shadow: 0px 2px 12px rgba(0,0,0,0.2);
    border: none;
    font-size: 16px;
    width: calc(100% - 20px);
    outline: none;
    /* padding-left: 30px; */
`;

const RecentSearches = styled.section``;
const ListItemGroup = styled.section`
    box-shadow: 0px 2px 12px rgba(0,0,0,0.2);
    margin: 10px;
`;
const GroupHeader = styled.section`
    font-size: 12px;
    padding: 20px;
`;
const AreasList = styled.section``;
const ListItem = styled.section`
    padding: 20px 20px;
    border-bottom: 1px solid #e9e9e9;
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: 0.3s;
    &:hover {
        background: rgba(0,0,0,0.1);
    }
    >i {
        font-size: 18px;
        margin-right: 10px;
    }
    &:last-of-type {
        border-bottom: none;
    }
`;

export default class NavigationToolbar extends React.PureComponent {
    state = {
        recentSearches: [],
        searchResults: []
    }

    componentDidMount() {
        this.setState({
            recentSearches: JSON.parse(localStorage.getItem('recentSearches')) || []
        });
        if (this.searchRef) {
            this.searchRef.focus();
        }
    }

    storeInLocalStorage = (entity) => {
        let recentSearches = this.state.recentSearches;
        if (!recentSearches.find(rs => rs.id === entity.id)) {
            recentSearches.unshift(entity);
        }
        localStorage.setItem('recentSearches', JSON.stringify(recentSearches.slice(0, MAX_RECENT_SEARCHES)));
    }

    handleListItemClick = (type, entity) => () => {
        entity.type = type;
        this.storeInLocalStorage(entity);
        this.props.onClose();
        this.props.onItemSelect(type, entity.id);
    }

    handleSearchChange = (event) => {
        const val = event.target.value;
        let searchResults = [];
        if (val) {
            const meetingFilterResults = floorPlan.map.meetingRooms.filter(m => m.id.includes(val) || m.name.includes(val));
            if (meetingFilterResults) {
                searchResults = searchResults.concat(meetingFilterResults.map(res => ({...res, type: 'meetingRooms'})));
            }

            const workstationsFilterResults = floorPlan.map.workStations.filter(m => m.id.includes(val));
            if (workstationsFilterResults) {
                searchResults = searchResults.concat(workstationsFilterResults.map(res => ({...res, type: 'workStations'})));
            }
        }
        this.setState({
            searchResults
        });
    }

    render() {
        return (
            <Holder>
                <SearchInput innerRef={ref => this.searchRef = ref} placeholder="Type meeting room, workstation" onChange={this.handleSearchChange} />
                {this.state.searchResults.length > 0 && 
                    this.state.searchResults.map(res => {
                    return (
                        <ListItem key={res.id} onClick={this.handleListItemClick(res.type, res)}>
                            <p> {res.name || res.id} </p>
                        </ListItem>
                    )
                })}
                {this.state.searchResults.length === 0 && <RecentSearches>
                    <ListItemGroup>
                        <GroupHeader>Recent Searches</GroupHeader>
                        {this.state.recentSearches.map(rs => {
                            return (
                                <ListItem key={rs.id}  onClick={this.handleListItemClick(rs.type, rs)}>
                                    <i className="material-icons">
                                        history
                                    </i>
                                    <p> {rs.name || rs.id} </p>
                                </ListItem>
                            )
                        })}
                    </ListItemGroup>
                </RecentSearches>}
                {this.state.searchResults.length === 0 && <AreasList>
                    <ListItemGroup>
                        <GroupHeader>Meeting Rooms</GroupHeader>
                        {floorPlan.map.meetingRooms.map(meetingRoom => {
                            return (
                                <ListItem key={meetingRoom.id} onClick={this.handleListItemClick('meetingRooms', meetingRoom)}>
                                    <i className="material-icons">
                                        meeting_room
                                    </i>
                                    <p>{meetingRoom.name}</p>
                                </ListItem>
                            );
                        })}
                    </ListItemGroup>
                    <ListItemGroup>
                        <GroupHeader>Pantry</GroupHeader>
                        {floorPlan.map.pantry.map(pantry => {
                            return (
                                <ListItem key={pantry.id} onClick={this.handleListItemClick('pantry', pantry)}>
                                    <i className="material-icons">
                                        fastfood
                                    </i>
                                    <p>{pantry.name}</p>
                                </ListItem>
                            );
                        })}
                    </ListItemGroup>
                    <ListItemGroup>
                        <GroupHeader>Workstations</GroupHeader>
                        {floorPlan.map.workStations.map(ws => {
                            return (
                                <ListItem key={ws.id} onClick={this.handleListItemClick('workstation', ws)}>
                                    <i className="material-icons">
                                        desktop_mac
                                    </i>
                                    <p>{`C-07-WS-${ws.id}`}</p>
                                </ListItem>
                            );
                        })}
                    </ListItemGroup>
                </AreasList>}
            </Holder>
        )
    }
}