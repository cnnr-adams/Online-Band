import React, { Component } from 'react';
import Piano from './Piano';
import OtherPiano from './OtherPiano';

const STYLE = {
    spacingContainer: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    bandPage: {
        backgroundColor: '#00003b',
        position: 'fixed',
        height: '100%',
        width: '100%'
    },
    text: {
        color: 'white'
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
        });
    }

    onNote = (isOn, note) => {
        this.props.backend.sendNote(isOn, note);
    }

    onInstrument = (instrument) => {
        this.props.backend.sendInstrument(instrument);
    }

    getPianos() {
        let otherPianos = [];
        console.log(this.props.backend.users);
        this.props.backend.users.forEach((user, id) => {

            otherPianos.push(<li key={id}><OtherPiano onNote={this.props.backend.onNote} id={id} onInstrument={this.props.backend.onInstrument} /></li>);
        });
        console.log(otherPianos);
        return <div style={STYLE.spacingContainer}>{otherPianos}</div>
    }
    render() {
        return (
            <div style={STYLE.bandPage}>
                <div style={STYLE.text}>Users connected: {this.state.length} at {this.state.lobbyId}</div>
                <Piano onNote={this.onNote} onInstrument={this.onInstrument} />
                {this.getPianos()}
            </div>

        )
    }
}