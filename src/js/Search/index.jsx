import React from 'react';
import styled from 'styled-components';
import { VelocityComponent } from 'velocity-react';

import config from '../common/config';
import floorPlan from '../common/floorPlan';

const Holder = styled.section`
    
`;

const SearchInput = styled.input`
    background: white;    
    margin: 10px;
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
    >i {
        font-size: 18px;
        margin-right: 10px;
    }
    &:last-of-type {
        border-bottom: none;
    }
`;

export default class NavigationToolbar extends React.PureComponent {
    componentDidMount() {
    }
    render() {
        return (
            <Holder>
                <SearchInput />
                <RecentSearches>
                    <ListItemGroup>
                        <GroupHeader>Recent Searches</GroupHeader>
                        <ListItem>
                            <i className="material-icons">
                                history
                            </i>
                            <p> 184 </p>
                        </ListItem>
                        <ListItem>
                            <i className="material-icons">
                                history
                            </i>
                            <p> 307 </p>
                        </ListItem>
                    </ListItemGroup>
                </RecentSearches>
                <AreasList>
                    <ListItemGroup>
                        <GroupHeader>Meeting Rooms</GroupHeader>
                        <ListItem>
                            <i className="material-icons">
                                meeting_room
                            </i>
                            <p> Sadma Salad </p>
                        </ListItem>
                        <ListItem>
                            <i className="material-icons">
                                meeting_room
                            </i>
                            <p> Oily Olive </p>
                        </ListItem>
                    </ListItemGroup>
                    <ListItemGroup>
                        <GroupHeader>Pantry</GroupHeader>
                        <ListItem>
                            <i className="material-icons">
                                fastfood
                            </i>
                            <p> Sadma Salad </p>
                        </ListItem>
                        <ListItem>
                            <i className="material-icons">
                                fastfood
                            </i>
                            <p> Oily Olive </p>
                        </ListItem>
                    </ListItemGroup>
                    <ListItemGroup>
                        <GroupHeader>Workstations</GroupHeader>
                        <ListItem>
                            <i className="material-icons">
                                desktop_mac
                            </i>
                            <p> Sadma Salad </p>
                        </ListItem>
                        <ListItem>
                            <i className="material-icons">
                                desktop_mac
                            </i>
                            <p> Oily Olive </p>
                        </ListItem>
                    </ListItemGroup>

                </AreasList>
            </Holder>
        )
    }
}