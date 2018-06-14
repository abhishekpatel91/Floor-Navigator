import React from 'react';
import styled from 'styled-components';
import { VelocityComponent } from 'velocity-react';
import Search from '../Search';
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
    padding-top: 20px;
    padding-right: 20px;
    cursor: pointer;
    >i {
        padding: 10px;
        border-radius: 50%;
        &:hover {
            background: rgba(0,0,0,0.3);
        }
    }
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
    constructor(props) {
        super(props);
        this.state = {
            searchOpen: false,
            type: null
        }
    }

    toggleSearch = () => {
        this.setState(state => ({searchOpen: !state.searchOpen}));
    }

    editField = (type) => {
        this.setState({ type }, this.toggleSearch);
    }

    redirect = (type, id) => {
        const obj = {
            from: this.props.from,
            to: this.props.to
        };
        obj[this.state.type] = `${type},${id}`;
        this.props.onDirectionsChange(obj.from, obj.to);
    }

    render() {
        const { from, to } = this.props;
        const fromArr = from && from.split(',');
        const toArr = to && to.split(',');
        return (
            <VelocityComponent
                animation={ this.props.page === 'direction' ? {
                    translateY: 0
                } : {
                        translateY: '-200px'
                    }}
                duration={300}
                easing='easeOutQuint'
            >
                <Holder>
                    <LeftArrow >
                        <i className="material-icons" onClick={this.props.goBack}>
                            arrow_back
                    </i>
                    </LeftArrow>
                    <NavHolder>
                        <NavSection>
                            <i className="material-icons">
                                my_location
                        </i>
                            <NavBox onClick={() => this.editField('from')}>{fromArr && fromArr[1] || 'My Location'}</NavBox>
                        </NavSection>
                        <NavSection>
                            <i className="material-icons">
                                location_on
                        </i>
                            <NavBox onClick={() => this.editField('to')}>{toArr && toArr[1]}</NavBox>
                        </NavSection>
                    </NavHolder>
                </Holder>
                {
                    this.state.searchOpen ?
                        <Search onItemSelect={this.redirect} onClose={this.toggleSearch} />
                        : null
                }
            </VelocityComponent>
        )
    }
}