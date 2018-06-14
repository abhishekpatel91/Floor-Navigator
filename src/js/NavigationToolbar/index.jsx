import React from 'react';
import styled from 'styled-components';
import { VelocityComponent } from 'velocity-react';

import config from '../common/config';

const Holder = styled.section`
    position: fixed;
    z-index: 4;
    background: ${config.primaryColor};
    top: 0;
    left: 0;
    height: 140px;
    display: flex;
    width: 100%;
    color: #fff;
    padding-right: 30px;
`;

const LeftArrow = styled.section`
    padding: 20px;
    padding-top: 30px;
    padding-right: 30px;
`;

const NavSection = styled.section`
    display: flex;
    margin-bottom: 10px;
    flex-grow: 1;
    align-items: center;
    >i {
        font-size: 18px;
    }
`;

const NavHolder = styled.section`
    padding: 30px 0;
    flex-grow: 1;
`;

const NavBox = styled.div`
    border: 1px solid #fff;
    border-radius: 2px;
    padding: 7px 10px;
    margin-left: 20px;
    width: 100%;
    font-size: 14px;
    cursor: pointer;
`;

export default class NavigationToolbar extends React.PureComponent {
    componentDidMount() {
    }
    render() {
        return (
            <VelocityComponent
                animation={true ? {
                    translateY: 0
                } : {
                        translateY: '-100%'
                    }}
                duration={300}
                easing='easeOutQuint'
            >
            <Holder>
                <LeftArrow>
                    <i className="material-icons">
                        arrow_back
                    </i>
                </LeftArrow>
                <NavHolder>
                    <NavSection>
                        <i className="material-icons">
                            my_location
                        </i>
                        <NavBox>My Location</NavBox>
                    </NavSection>
                    <NavSection>
                        <i className="material-icons">
                            location_on
                        </i>
                        <NavBox>Cubbon Park</NavBox>
                    </NavSection>
                </NavHolder>
                </Holder>
            </VelocityComponent>    
        )
    }
}