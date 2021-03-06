import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import './index.scss';

const Holder = styled.section`
    background: white;    
    display: flex;
    z-index: 1;
    position: fixed;
    width: calc(100% - 20px);
    margin: 10px;
    box-sizing: border-box;
    padding: 12px 16px;
    border-radius: 3px;
    box-shadow: 0px 2px 12px rgba(0,0,0,0.2);
`;

const HamBurgerMenu = styled.section`
    position: relative;
    margin-right: 10px;
`;

const SearchInput = styled.input`
    border: none;
    font-size: 16px;
    width: 100%;
    outline: none;
`;


export default class HeaderBar extends React.PureComponent {
    render() {
        return (
            <Holder>
                <HamBurgerMenu>
                    <div id="menuToggle">
                        <input type="checkbox" />
                        <span></span>
                        <span></span>
                        <span></span>
                        <ul id="menu">
                            <a href="#"><li>Home</li></a>
                            <a href="#"><li>About</li></a>
                            <a href="#"><li>Info</li></a>
                            <a href="#"><li>Contact</li></a>
                            <Link to="/events"><li>Events</li></Link>
                            <a href="https://erikterwan.com/" target="_blank"><li>Show me more</li></a>
                        </ul>
                    </div>
                </HamBurgerMenu>
                <SearchInput
                    onClick={this.props.onSearchClick}
                    type="search"
                    placeholder="Search workstation, meeting room etc"
                />
            </Holder>
        );
    }
}