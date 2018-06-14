import React from 'react';
import styled from 'styled-components';
import { VelocityComponent, VelocityTransitionGroup } from 'velocity-react';

const Holder = styled.footer`
    background: #fff;
    height: 15vh;
    padding: 20px;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100vw;
    /* transform: translateY(20vh); */
    box-shadow: 0px -2px 12px rgba(0,0,0,0.2);
`;

const Name = styled.h2`
    font-weight: medium;
`;

export default class ActionBar extends React.PureComponent {
    state = {
        show: false
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({
                show: true
            })
        }, 2000);
        // setTimeout(() => {
        //     this.setState({
        //         show: false
        //     })
        // }, 3000);
    }
    render() {
        return (
            <VelocityComponent
                animation={this.state.show ? {
                    translateY: 0
                } : {
                        translateY: '20vh'
                    }}
                duration={300}
                easing='easeOutQuint'
            >
                <Holder>
                    <Name>Oily Olive</Name>
                </Holder>
            </VelocityComponent>
        );
    }
}