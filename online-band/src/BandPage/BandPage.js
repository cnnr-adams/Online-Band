import React, { Component } from 'react';
import Piano from './Piano';
import OtherPiano from './OtherPiano';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import "./Gradient.css";
const STYLE = {
    spacingContainer: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    bandPage: {

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

    onVolume = (volume) => {
        this.props.backend.sendVolume(volume);
    }

    getPianos() {
        let otherPianos = [];
        console.log(this.props.backend.users);
        this.props.backend.users.forEach((user, id) => {

            otherPianos.push(<li key={id}><OtherPiano username={user.username} volume={user.volume} instrument={user.instrument} onLeaveUsers={this.props.backend.onLeaveUsers} onNote={this.props.backend.onNote} id={id} onInstrument={this.props.backend.onInstrument} onVolume={this.props.backend.onVolume} /></li>);
        });
        console.log(otherPianos);
        return <div style={STYLE.spacingContainer}>{otherPianos}</div>
    }
    render() {
        return (
            <div className="grad" onBlur={(e) => { this.refs.piano.upAll(); }} onKeyDown={(e) => { }} onKeyUp={(e) => { }}>
                <div style={STYLE.text}>Users connected: {this.state.length} at {this.state.lobbyId}</div>
                <KeyboardEventHandler
                    handleFocusableElements={true}
                    handleEventType="keyup"
                    handleKeys={['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'w', 'e', 't', 'y', 'u', 'i', 'r', 'o', 'z', 'x', 'p']}
                    onKeyEvent={(key, e) => this.refs.piano.keyboardUp(e)} >
                </KeyboardEventHandler>
                <KeyboardEventHandler
                    handleFocusableElements={true}
                    handleEventType="keydown"
                    handleKeys={['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'w', 'e', 't', 'y', 'u', 'i', 'r', 'o', 'z', 'x', 'p']}
                    onKeyEvent={(key, e) => this.refs.piano.keyboardDown(e)} >
                </KeyboardEventHandler>
                <Piano ref="piano" defaultVolume={this.props.defaultVolume} defaultInstrument={this.props.defaultInstrument} onNote={this.onNote} onInstrument={this.onInstrument} onVolume={this.onVolume} />
                {this.getPianos()}
            </div>

        )
    }
}