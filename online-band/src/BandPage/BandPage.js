import React, { Component } from 'react';
import Piano from './Piano';
import OtherPiano from './OtherPiano';

const STYLE = {
    spacingContainer: {
        display: 'flex',
        'justify-content': 'space-between'
    },
    bandPage: {
        backgroundColor: '#00003b',
        position: 'fixed',
        height: '100%',
        width: '100%'
    }
}
export default class extends Component {
    constructor(props) {
        super(props);
        this.state = { length: this.props.backend.users.size, lobbyId: this.props.lobbyId };
    }
    componentDidMount() {
        this.props.backend.onNewUsers((newUser) => {
            this.setState({ length: this.props.backend.users.size });
        });
        this.props.backend.onLeaveUsers((leaveUser) => {
            this.setState({ length: this.props.backend.users.size });
        })
    }
    render() {
        let otherPianos = <div style={STYLE.spacingContainer}>;
        for (let user in this.props.backend.users) {
                otherPianos += <OtherPiano />
            }
            otherPianos += </div>;
        return (
            <div style={STYLE.bandPage}>
                Users connected: {this.state.length} at {this.state.lobbyId}
                <Piano />

                {otherPianos}
            </div>

        )
    }
}