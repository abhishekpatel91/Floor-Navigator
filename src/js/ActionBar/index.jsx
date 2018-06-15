import React from 'react';
import styled from 'styled-components';
import { VelocityComponent } from 'velocity-react';
import floorPlan from '../common/floorPlan';

import './index.scss';
const BACKEND_HOST = 'http://localhost:8085';

const blockTypes = {
    meetingRooms: 'Meeting Room',
    workStations: 'Work Stations',
    pantry: 'Pantry',
    areas: 'Areas'
}

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
    font-weight: 500;
    margin-bottom: 10px;
    text-transform: capitalize;
`;

const AreaType = styled.h4`
    font-weight: normal;
    margin-bottom: 10px;
    font-size: 13px;
    span {
        color: #7f7f7f;
    }
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
const BroadcastButton = styled.button`
    position: absolute;
    right: 180px;
    bottom: 0;
`;

export default class ActionBar extends React.PureComponent {
    state = {
        show: false
    }

    componentDidMount() {

    }

    hideBar = () => {
        this.props.onClose();
    }

    openDirections = (type, data) => () => {
        this.props.openDirections(undefined, `${type},${data.id}`);
    }

    pushNotification = (type, data) => () => {
        fetch(`${BACKEND_HOST}/push`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: data.id,
                type
            })
        }).then(res => {
            console.log('Notif sent');
        })
    }

    render() {
        const { location, pathLocation } = this.props;
        const [type, id] = location.split(',');
        const data = (floorPlan.map[type] || []).find(item => item.id === id);

        if (!data) {
            return null;
        }

        return (
            <VelocityComponent
                animation={!!data ? {
                    translateY: 0
                } : {
                        translateY: '20vh'
                    }}
                duration={300}
                easing='easeOutQuint'
            >
                <Holder>
                    <InfoSection>
                        {data && (data.name || data.id) && <Name><strong>Name: </strong>{data.name || data.id}</Name>}
                        {type && <AreaType><span>Type: </span>{blockTypes[type]}</AreaType>}
                        {pathLocation.state && pathLocation.state.event &&
                            <AreaType><span>Upcoming Event: </span>{pathLocation.state.event.summary}</AreaType>
                        }
                    </InfoSection>
                    <ActionPanel>
                        <DirectionsButton type="button" className="material" onClick={this.openDirections(type, data)}>
                            Directions
                        </DirectionsButton>
                        <BroadcastButton type="button" className="material" onClick={this.pushNotification(type, data)}>
                            BroadCast
                        </BroadcastButton>
                    </ActionPanel>
                    <button type="button" className="close" onClick={this.hideBar} />
                </Holder>
            </VelocityComponent>
        );
    }
}