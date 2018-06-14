import React from 'react';
import styled from 'styled-components';
import { VelocityComponent } from 'velocity-react';

import config from '../common/config';
import floorPlan from '../common/floorPlan';

const Holder = styled.section`
    
`;

const SearchInput = styled.input`
    background: white;    
    width: 100%;
    margin: 10px;
    box-sizing: border-box;
    padding: 12px 16px;
    border-radius: 3px;
    box-shadow: 0px 2px 12px rgba(0,0,0,0.2);
    border: none;
    font-size: 16px;
    width: 100%;
    outline: none;
`;

const RecentSearches = styled.section``;
const AreasList = styled.section``;
const ListItem = styled.section`
    padding: 10px 20px;
    border-bottom: 1px solid #ccc;
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
                    </RecentSearches>
                    <AreasList>
                        <ListItem></ListItem>
                    </AreasList>
                </Holder>
        )
    }
}