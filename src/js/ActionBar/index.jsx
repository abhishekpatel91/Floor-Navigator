import React from 'react';
import styled from 'styled-components';
import { VelocityComponent, VelocityTransitionGroup } from 'velocity-react';

import './index.scss';

const Holder = styled.footer`
    background: #fff;
    height: 20vh;
    padding: 20px;
    position: fixed;
    display: flex;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1;
    width: 100vw;
    box-shadow: 0px -2px 12px rgba(0,0,0,0.2);
`;

const Name = styled.h4`
    font-weight: normal;
    margin-bottom: 10px;
`;

const AreaType = styled.h4`
    font-weight: normal;
    margin-bottom: 10px;
`;
const AreaId = styled.h4`
    font-weight: medium;
    margin-bottom: 10px;
`;

const InfoSection = styled.section`
    flex-grow: 1;
`;

const ActionPanel = styled.section`
    padding-top: 40px;
    flex-shrink: 0;
    position: relative;
`;

const DirectionsButton = styled.button`
    position: absolute;
    right: 0;
    bottom: 0;
`;

export default class ActionBar extends React.PureComponent {
    state = {
        show: false
    }

    componentDidMount() {

    }

    hideBar = () => {
        this.props.handleOpenActionBar(null);
    }

    render() {
        const { data } = this.props;
        return (
            <VelocityComponent
                animation={!!this.props.data ? {
                    translateY: 0
                } : {
                        translateY: '20vh'
                    }}
                duration={300}
                easing='easeOutQuint'
            >
                <Holder>
                    <InfoSection>
                        <AreaId><strong>Id: </strong>{data && data.area.id}</AreaId>
                        <AreaType><strong>Type: </strong>{data && data.type}</AreaType>
                        {data && data.area.name && <Name><strong>Name: </strong>{data.area.name}</Name>}
                    </InfoSection>
                    <ActionPanel>
                        <DirectionsButton type="button" className="material">Directions</DirectionsButton>
                    </ActionPanel>
                    <button type="button" className="close" onClick={this.hideBar} />
                </Holder>
            </VelocityComponent>
        );
    }
}