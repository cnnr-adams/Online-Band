import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Slider, { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';
import MIDISounds from 'midi-sounds-react';

const STYLE = {
    hide: {
        display: 'none',
        width: 0,
        height: 0
    },
    innerPiano: {
        margin: 'auto',
        padding: '0.25em',
    },
    pianoControlsParent: {
        display: 'flex',
        flexDirection: 'row'
    },
    pianoControls: {
        margin: '0.5em'
    },
    piano: {
        margin: 'auto',
        background: 'linear-gradient(to top, #8c8c8c 95%, #595959 100%)',
        display: 'table',
        width: '-moz-fit-content',
        borderRadius: '10px',
        alignContent: 'center'
    },
    whiteKeys: {
        position: 'relative',
        top: '1.3cm',
        marginTop: '-1.3cm'
    },
    blackKeys: {
    },
    keyWhite: {
        backgroundColor: '#ffffff',
        width: '0.5cm',
        height: '2cm',
        borderRadius: '3px'
    },
    keyWhitePress: {
        background: 'linear-gradient(to bottom, #ffffff 25%, #757575 100%)',
        width: '0.5cm',
        height: '2cm',
        borderRadius: '3px'
    },
    keyBlack: {
        backgroundColor: '#333333',
        width: '0.5cm',
        height: '1.15cm',
        borderRadius: '3px'
    },
    keyBlackPress: {
        background: 'linear-gradient(to bottom, #333333 25%, #000000 100%)',
        width: '0.5cm',
        height: '1.15cm',
        borderRadius: '3px'
    },
    keyNo: {
        width: '0.5cm',
        height: '0.5cm'
    },
    keyMargin: {
        width: '0.25cm',
        height: '0.5cm'
    }
};

export default class extends Component {
    constructor(props) {
        super(props);
        this.midiNotes = [];
        this.state = {
            volume: 0.1,
            selectedInstrument: 192
            , status: '?',
            octave: 3
        };
        this.keysDown = new Set();
    }
    componentDidMount() {
        this.envelopes = [];
        this.startListening();
    }
    onSelectInstrument(e) {
        var list = e.target;
        let n = list.options[list.selectedIndex].getAttribute("value");
        this.setState({
            selectedInstrument: n
        });
        this.props.onInstrument(n);
        this.midiSounds.cacheInstrument(n);
    }
    createSelectItems() {
        if (this.midiSounds) {
            if (!(this.items)) {
                this.items = [];
                for (let i = 0; i < this.midiSounds.player.loader.instrumentKeys().length; i++) {
                    this.items.push(<option key={i} value={i}>{'' + (i + 0) + '. ' + this.midiSounds.player.loader.instrumentInfo(i).title}</option>);
                }
            }
            return this.items;
        }
    }
    detectLeftButton(event) {
        if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) {
            return false;
        } else if ('buttons' in event) {
            return event.buttons === 1;
        } else if ('which' in event) {
            return event.which === 1;
        } else {
            return (event.button === 1 || event.type === 'click');
        }
    }

    keyOver(event, n) {
        this.pauseEvent(event);
        if (!this.detectLeftButton(event)) {
            return;
        } else {
            this.keyDown(n);
        }
    }

    keyDown(n, e, v) {
        if (e) {
            this.pauseEvent(e);
        }
        if (this.envelopes[n]) {
            return;
        }
        if (window[this.midiSounds.player.loader.instrumentInfo(this.state.selectedInstrument).variable]) {
            this.keysDown.add(n);
            this.keyUp(n);
            var volume = this.state.volume;


            this.props.onNote(true, n);
            this.envelopes[n] = this.midiSounds.player.queueWaveTable(this.midiSounds.audioContext
                , this.midiSounds.equalizer.input
                , window[this.midiSounds.player.loader.instrumentInfo(this.state.selectedInstrument).variable]
                , 0, n, 9999, volume);
            this.setState(this.state);
        }
    }
    keyUp(n) {
        if (this.envelopes) {
            if (this.envelopes[n]) {
                this.envelopes[n].cancel();
                this.envelopes[n] = null;
                this.props.onNote(false, n);
                this.setState(this.state);
            }
        }
    }
    upAll() {
        for (let i = 0; i < this.envelopes.length; i++) {
            if (this.envelopes[i]) {
                this.envelopes[i].cancel();
                this.envelopes[i] = null;
                this.props.onNote(false, i);
                this.setState(this.state);
            }
        }
    }
    pressed(n) {
        if (this.envelopes) {
            if (this.envelopes[n]) {
                return true;
            }
        }
        return false;
    }
    pauseEvent(e) {
        if (e.stopPropagation) e.stopPropagation();
        if (e.preventDefault) e.preventDefault();
        e.cancelBubble = true;
        e.returnValue = false;
        return false;
    }
    midiOnMIDImessage(event) {
        var data = event.data;
        var cmd = data[0] >> 4;
        var channel = data[0] & 0xf;
        var type = data[0] & 0xf0;
        var pitch = data[1];
        var velocity = data[2];
        switch (type) {
            case 144:
                this.keyDown(pitch, velocity / 127);
                break;
            case 128:
                this.keyUp(pitch);
                break;
        }
    }
    onMIDIOnStateChange(event) {
        this.setState({ status: event.port.manufacturer + ' ' + event.port.name + ' ' + event.port.state });
    }
    requestMIDIAccessSuccess(midi) {
        var inputs = midi.inputs.values();
        for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
            input.value.onmidimessage = this.midiOnMIDImessage.bind(this);
        }
        midi.onstatechange = this.onMIDIOnStateChange.bind(this);
    }
    requestMIDIAccessFailure(e) {
        console.log('requestMIDIAccessFailure', e);
        this.setState({ status: 'MIDI Access Failure' });
    }
    startListening() {
        this.setState({ status: 'waiting' });
        if (navigator.requestMIDIAccess) {
            navigator.requestMIDIAccess().then(this.requestMIDIAccessSuccess.bind(this), this.requestMIDIAccessFailure.bind(this));
        } else {
            this.setState({ status: 'navigator.requestMIDIAccess undefined' });
        }
    }
    keyboardDown(e) {
        switch (e.key) {
            case "a":
                this.keyDown(0 + 12 * this.state.octave, e);
                break;
            case "w":
                this.keyDown(1 + 12 * this.state.octave, e);
                break;
            case "s":
                this.keyDown(2 + 12 * this.state.octave, e);
                break;
            case "e":
                this.keyDown(3 + 12 * this.state.octave, e);
                break;
            case "d":
                this.keyDown(4 + 12 * this.state.octave, e);
                break;
            case "f":
                this.keyDown(5 + 12 * this.state.octave, e);
                break;
            case "t":
                this.keyDown(6 + 12 * this.state.octave, e);
                break;
            case "g":
                this.keyDown(7 + 12 * this.state.octave, e);
                break;
            case "y":
                this.keyDown(8 + 12 * this.state.octave, e);
                break;
            case "h":
                this.keyDown(9 + 12 * this.state.octave, e);
                break;
            case "u":
                this.keyDown(10 + 12 * this.state.octave, e);
                break;
            case "j":
                this.keyDown(11 + 12 * this.state.octave, e);
                break;
            case "k":
                this.keyDown(12 + 12 * this.state.octave, e);
                break;
            case "o":
                this.keyDown(13 + 12 * this.state.octave, e);
                break;
            case "l":
                this.keyDown(14 + 12 * this.state.octave, e);
                break;
        }
    }
    keyboardUp(e) {
        switch (e.key) {
            case "x": this.state.octave++;
                this.upAll();
                break;
            case "z": this.state.octave--;
                this.upAll();
                break;
            case "a":
                this.keyUp(0 + 12 * this.state.octave);
                break;
            case "w":
                this.keyUp(1 + 12 * this.state.octave);
                break;
            case "s":
                this.keyUp(2 + 12 * this.state.octave);
                break;
            case "e":
                this.keyUp(3 + 12 * this.state.octave);
                break;
            case "d":
                this.keyUp(4 + 12 * this.state.octave);
                break;
            case "f":
                this.keyUp(5 + 12 * this.state.octave);
                break;
            case "t":
                this.keyUp(6 + 12 * this.state.octave);
                break;
            case "g":
                this.keyUp(7 + 12 * this.state.octave);
                break;
            case "y":
                this.keyUp(8 + 12 * this.state.octave);
                break;
            case "h":
                this.keyUp(9 + 12 * this.state.octave);
                break;
            case "u":
                this.keyUp(10 + 12 * this.state.octave);
                break;
            case "j":
                this.keyUp(11 + 12 * this.state.octave);
                break;
            case "k":
                this.keyUp(12 + 12 * this.state.octave);
                break;
            case "o":
                this.keyUp(13 + 12 * this.state.octave);
                break;
            case "l":
                this.keyUp(14 + 12 * this.state.octave);
                break;
        }
    }
    render() {
        return (
            <div style={STYLE.piano}>
                <div style={STYLE.innerPiano}>
                    <div style={STYLE.pianoControlsParent}>
                        <select style={STYLE.pianoControls} value={this.state.selectedInstrument} onChange={this.onSelectInstrument.bind(this)}>{this.createSelectItems()}</select>
                        <Slider style={STYLE.pianoControls} min={1} max={20} defaultValue={15} height='10' onChange={(volume) => { this.state.volume = (volume / 50) - .025; this.props.onVolume(volume) }} />
                    </div>
                    <table style={STYLE.whiteKeys} align="center">
                        <tbody>
                            <tr>

                                <td style={STYLE.keyMargin}></td>

                                <td style={(this.pressed(1 + 12 * 2)) ? STYLE.keyBlackPress : STYLE.keyBlack} disabled={true} onMouseOver={(e) => { this.keyOver(e, 1 + 12 * 2) }} onMouseDown={(e) => this.keyDown(1 + 12 * 2, e)} onMouseUp={(e) => this.keyUp(1 + 12 * 2)} onMouseOut={(e) => this.keyUp(1 + 12 * 2)}></td>
                                <td style={(this.pressed(3 + 12 * 2)) ? STYLE.keyBlackPress : STYLE.keyBlack} disabled={true} onMouseOver={(e) => { this.keyOver(e, 3 + 12 * 2) }} onMouseDown={(e) => this.keyDown(3 + 12 * 2, e)} onMouseUp={(e) => this.keyUp(3 + 12 * 2)} onMouseOut={(e) => this.keyUp(3 + 12 * 2)}></td>
                                <td style={STYLE.keyNo}></td>
                                <td style={(this.pressed(6 + 12 * 2)) ? STYLE.keyBlackPress : STYLE.keyBlack} onMouseOver={(e) => { this.keyOver(e, 6 + 12 * 2) }} onMouseDown={(e) => this.keyDown(6 + 12 * 2, e)} onMouseUp={(e) => this.keyUp(6 + 12 * 2)} onMouseOut={(e) => this.keyUp(6 + 12 * 2)}></td>
                                <td style={(this.pressed(8 + 12 * 2)) ? STYLE.keyBlackPress : STYLE.keyBlack} onMouseOver={(e) => { this.keyOver(e, 8 + 12 * 2) }} onMouseDown={(e) => this.keyDown(8 + 12 * 2, e)} onMouseUp={(e) => this.keyUp(8 + 12 * 2)} onMouseOut={(e) => this.keyUp(8 + 12 * 2)}></td>
                                <td style={(this.pressed(10 + 12 * 2)) ? STYLE.keyBlackPress : STYLE.keyBlack} onMouseOver={(e) => { this.keyOver(e, 10 + 12 * 2) }} onMouseDown={(e) => this.keyDown(10 + 12 * 2, e)} onMouseUp={(e) => this.keyUp(10 + 12 * 2)} onMouseOut={(e) => this.keyUp(10 + 12 * 2)}></td>
                                <td style={STYLE.keyNo}></td>

                                <td style={(this.pressed(1 + 12 * 3)) ? STYLE.keyBlackPress : STYLE.keyBlack} onMouseOver={(e) => { this.keyOver(e, 1 + 12 * 3) }} onMouseDown={(e) => this.keyDown(1 + 12 * 3, e)} onMouseUp={(e) => this.keyUp(1 + 12 * 3)} onMouseOut={(e) => this.keyUp(1 + 12 * 3)}></td>
                                <td style={(this.pressed(3 + 12 * 3)) ? STYLE.keyBlackPress : STYLE.keyBlack} onMouseOver={(e) => { this.keyOver(e, 3 + 12 * 3) }} onMouseDown={(e) => this.keyDown(3 + 12 * 3, e)} onMouseUp={(e) => this.keyUp(3 + 12 * 3)} onMouseOut={(e) => this.keyUp(3 + 12 * 3)}></td>
                                <td style={STYLE.keyNo}></td>
                                <td style={(this.pressed(6 + 12 * 3)) ? STYLE.keyBlackPress : STYLE.keyBlack} onMouseOver={(e) => { this.keyOver(e, 6 + 12 * 3) }} onMouseDown={(e) => this.keyDown(6 + 12 * 3, e)} onMouseUp={(e) => this.keyUp(6 + 12 * 3)} onMouseOut={(e) => this.keyUp(6 + 12 * 3)}></td>
                                <td style={(this.pressed(8 + 12 * 3)) ? STYLE.keyBlackPress : STYLE.keyBlack} onMouseOver={(e) => { this.keyOver(e, 8 + 12 * 3) }} onMouseDown={(e) => this.keyDown(8 + 12 * 3, e)} onMouseUp={(e) => this.keyUp(8 + 12 * 3)} onMouseOut={(e) => this.keyUp(8 + 12 * 3)}></td>
                                <td style={(this.pressed(10 + 12 * 3)) ? STYLE.keyBlackPress : STYLE.keyBlack} onMouseOver={(e) => { this.keyOver(e, 10 + 12 * 3) }} onMouseDown={(e) => this.keyDown(10 + 12 * 3, e)} onMouseUp={(e) => this.keyUp(10 + 12 * 3)} onMouseOut={(e) => this.keyUp(10 + 12 * 3)}></td>
                                <td style={STYLE.keyNo}></td>

                                <td style={(this.pressed(1 + 12 * 4)) ? STYLE.keyBlackPress : STYLE.keyBlack} onMouseOver={(e) => { this.keyOver(e, 1 + 12 * 4) }} onMouseDown={(e) => this.keyDown(1 + 12 * 4, e)} onMouseUp={(e) => this.keyUp(1 + 12 * 4)} onMouseOut={(e) => this.keyUp(1 + 12 * 4)}></td>
                                <td style={(this.pressed(3 + 12 * 4)) ? STYLE.keyBlackPress : STYLE.keyBlack} onMouseOver={(e) => { this.keyOver(e, 3 + 12 * 4) }} onMouseDown={(e) => this.keyDown(3 + 12 * 4, e)} onMouseUp={(e) => this.keyUp(3 + 12 * 4)} onMouseOut={(e) => this.keyUp(3 + 12 * 4)}></td>
                                <td style={STYLE.keyNo}></td>
                                <td style={(this.pressed(6 + 12 * 4)) ? STYLE.keyBlackPress : STYLE.keyBlack} onMouseOver={(e) => { this.keyOver(e, 6 + 12 * 4) }} onMouseDown={(e) => this.keyDown(6 + 12 * 4, e)} onMouseUp={(e) => this.keyUp(6 + 12 * 4)} onMouseOut={(e) => this.keyUp(6 + 12 * 4)}></td>
                                <td style={(this.pressed(8 + 12 * 4)) ? STYLE.keyBlackPress : STYLE.keyBlack} onMouseOver={(e) => { this.keyOver(e, 8 + 12 * 4) }} onMouseDown={(e) => this.keyDown(8 + 12 * 4, e)} onMouseUp={(e) => this.keyUp(8 + 12 * 4)} onMouseOut={(e) => this.keyUp(8 + 12 * 4)}></td>
                                <td style={(this.pressed(10 + 12 * 4)) ? STYLE.keyBlackPress : STYLE.keyBlack} onMouseOver={(e) => { this.keyOver(e, 10 + 12 * 4) }} onMouseDown={(e) => this.keyDown(10 + 12 * 4, e)} onMouseUp={(e) => this.keyUp(10 + 12 * 4)} onMouseOut={(e) => this.keyUp(10 + 12 * 4)}></td>
                                <td style={STYLE.keyNo}></td>

                                <td style={(this.pressed(1 + 12 * 5)) ? STYLE.keyBlackPress : STYLE.keyBlack} onMouseOver={(e) => { this.keyOver(e, 1 + 12 * 5) }} onMouseDown={(e) => this.keyDown(1 + 12 * 5, e)} onMouseUp={(e) => this.keyUp(1 + 12 * 5)} onMouseOut={(e) => this.keyUp(1 + 12 * 5)}></td>
                                <td style={(this.pressed(3 + 12 * 5)) ? STYLE.keyBlackPress : STYLE.keyBlack} onMouseOver={(e) => { this.keyOver(e, 3 + 12 * 5) }} onMouseDown={(e) => this.keyDown(3 + 12 * 5, e)} onMouseUp={(e) => this.keyUp(3 + 12 * 5)} onMouseOut={(e) => this.keyUp(3 + 12 * 5)}></td>
                                <td style={STYLE.keyNo}></td>
                                <td style={(this.pressed(6 + 12 * 5)) ? STYLE.keyBlackPress : STYLE.keyBlack} onMouseOver={(e) => { this.keyOver(e, 6 + 12 * 5) }} onMouseDown={(e) => this.keyDown(6 + 12 * 5, e)} onMouseUp={(e) => this.keyUp(6 + 12 * 5)} onMouseOut={(e) => this.keyUp(6 + 12 * 5)}></td>
                                <td style={(this.pressed(8 + 12 * 5)) ? STYLE.keyBlackPress : STYLE.keyBlack} onMouseOver={(e) => { this.keyOver(e, 8 + 12 * 5) }} onMouseDown={(e) => this.keyDown(8 + 12 * 5, e)} onMouseUp={(e) => this.keyUp(8 + 12 * 5)} onMouseOut={(e) => this.keyUp(8 + 12 * 5)}></td>
                                <td style={(this.pressed(10 + 12 * 5)) ? STYLE.keyBlackPress : STYLE.keyBlack} onMouseOver={(e) => { this.keyOver(e, 10 + 12 * 5) }} onMouseDown={(e) => this.keyDown(10 + 12 * 5, e)} onMouseUp={(e) => this.keyUp(10 + 12 * 5)} onMouseOut={(e) => this.keyUp(10 + 12 * 5)}></td>
                                <td style={STYLE.keyNo}></td>

                            </tr>
                        </tbody>
                    </table>
                    <table style={STYLE.blackKeys} align="center">
                        <tbody>
                            <tr>
                                <td style={(this.pressed(0 + 12 * 2)) ? STYLE.keyWhitePress : STYLE.keyWhite} onMouseOver={(e) => { this.keyOver(e, 0 + 12 * 2) }} onMouseDown={(e) => this.keyDown(0 + 12 * 2, e)} onMouseUp={(e) => this.keyUp(0 + 12 * 2)} onMouseOut={(e) => this.keyUp(0 + 12 * 2)}></td>
                                <td style={(this.pressed(2 + 12 * 2)) ? STYLE.keyWhitePress : STYLE.keyWhite} onMouseOver={(e) => { this.keyOver(e, 2 + 12 * 2) }} onMouseDown={(e) => this.keyDown(2 + 12 * 2, e)} onMouseUp={(e) => this.keyUp(2 + 12 * 2)} onMouseOut={(e) => this.keyUp(2 + 12 * 2)}></td>
                                <td style={(this.pressed(4 + 12 * 2)) ? STYLE.keyWhitePress : STYLE.keyWhite} onMouseOver={(e) => { this.keyOver(e, 4 + 12 * 2) }} onMouseDown={(e) => this.keyDown(4 + 12 * 2, e)} onMouseUp={(e) => this.keyUp(4 + 12 * 2)} onMouseOut={(e) => this.keyUp(4 + 12 * 2)}></td>
                                <td style={(this.pressed(5 + 12 * 2)) ? STYLE.keyWhitePress : STYLE.keyWhite} onMouseOver={(e) => { this.keyOver(e, 5 + 12 * 2) }} onMouseDown={(e) => this.keyDown(5 + 12 * 2, e)} onMouseUp={(e) => this.keyUp(5 + 12 * 2)} onMouseOut={(e) => this.keyUp(5 + 12 * 2)}></td>
                                <td style={(this.pressed(7 + 12 * 2)) ? STYLE.keyWhitePress : STYLE.keyWhite} onMouseOver={(e) => { this.keyOver(e, 7 + 12 * 2) }} onMouseDown={(e) => this.keyDown(7 + 12 * 2, e)} onMouseUp={(e) => this.keyUp(7 + 12 * 2)} onMouseOut={(e) => this.keyUp(7 + 12 * 2)}></td>
                                <td style={(this.pressed(9 + 12 * 2)) ? STYLE.keyWhitePress : STYLE.keyWhite} onMouseOver={(e) => { this.keyOver(e, 9 + 12 * 2) }} onMouseDown={(e) => this.keyDown(9 + 12 * 2, e)} onMouseUp={(e) => this.keyUp(9 + 12 * 2)} onMouseOut={(e) => this.keyUp(9 + 12 * 2)}></td>
                                <td style={(this.pressed(11 + 12 * 2)) ? STYLE.keyWhitePress : STYLE.keyWhite} onMouseOver={(e) => { this.keyOver(e, 11 + 12 * 2) }} onMouseDown={(e) => this.keyDown(11 + 12 * 2, e)} onMouseUp={(e) => this.keyUp(11 + 12 * 2)} onMouseOut={(e) => this.keyUp(11 + 12 * 2)}></td>

                                <td style={(this.pressed(0 + 12 * 3)) ? STYLE.keyWhitePress : STYLE.keyWhite} onMouseOver={(e) => { this.keyOver(e, 0 + 12 * 3) }} onMouseDown={(e) => this.keyDown(0 + 12 * 3, e)} onMouseUp={(e) => this.keyUp(0 + 12 * 3)} onMouseOut={(e) => this.keyUp(0 + 12 * 3)}></td>
                                <td style={(this.pressed(2 + 12 * 3)) ? STYLE.keyWhitePress : STYLE.keyWhite} onMouseOver={(e) => { this.keyOver(e, 2 + 12 * 3) }} onMouseDown={(e) => this.keyDown(2 + 12 * 3, e)} onMouseUp={(e) => this.keyUp(2 + 12 * 3)} onMouseOut={(e) => this.keyUp(2 + 12 * 3)}></td>
                                <td style={(this.pressed(4 + 12 * 3)) ? STYLE.keyWhitePress : STYLE.keyWhite} onMouseOver={(e) => { this.keyOver(e, 4 + 12 * 3) }} onMouseDown={(e) => this.keyDown(4 + 12 * 3, e)} onMouseUp={(e) => this.keyUp(4 + 12 * 3)} onMouseOut={(e) => this.keyUp(4 + 12 * 3)}></td>
                                <td style={(this.pressed(5 + 12 * 3)) ? STYLE.keyWhitePress : STYLE.keyWhite} onMouseOver={(e) => { this.keyOver(e, 5 + 12 * 3) }} onMouseDown={(e) => this.keyDown(5 + 12 * 3, e)} onMouseUp={(e) => this.keyUp(5 + 12 * 3)} onMouseOut={(e) => this.keyUp(5 + 12 * 3)}></td>
                                <td style={(this.pressed(7 + 12 * 3)) ? STYLE.keyWhitePress : STYLE.keyWhite} onMouseOver={(e) => { this.keyOver(e, 7 + 12 * 3) }} onMouseDown={(e) => this.keyDown(7 + 12 * 3, e)} onMouseUp={(e) => this.keyUp(7 + 12 * 3)} onMouseOut={(e) => this.keyUp(7 + 12 * 3)}></td>
                                <td style={(this.pressed(9 + 12 * 3)) ? STYLE.keyWhitePress : STYLE.keyWhite} onMouseOver={(e) => { this.keyOver(e, 9 + 12 * 3) }} onMouseDown={(e) => this.keyDown(9 + 12 * 3, e)} onMouseUp={(e) => this.keyUp(9 + 12 * 3)} onMouseOut={(e) => this.keyUp(9 + 12 * 3)}></td>
                                <td style={(this.pressed(11 + 12 * 3)) ? STYLE.keyWhitePress : STYLE.keyWhite} onMouseOver={(e) => { this.keyOver(e, 11 + 12 * 3) }} onMouseDown={(e) => this.keyDown(11 + 12 * 3, e)} onMouseUp={(e) => this.keyUp(11 + 12 * 3)} onMouseOut={(e) => this.keyUp(11 + 12 * 3)}></td>

                                <td style={(this.pressed(0 + 12 * 4)) ? STYLE.keyWhitePress : STYLE.keyWhite} onMouseOver={(e) => { this.keyOver(e, 0 + 12 * 4) }} onMouseDown={(e) => this.keyDown(0 + 12 * 4, e)} onMouseUp={(e) => this.keyUp(0 + 12 * 4)} onMouseOut={(e) => this.keyUp(0 + 12 * 4)}></td>
                                <td style={(this.pressed(2 + 12 * 4)) ? STYLE.keyWhitePress : STYLE.keyWhite} onMouseOver={(e) => { this.keyOver(e, 2 + 12 * 4) }} onMouseDown={(e) => this.keyDown(2 + 12 * 4, e)} onMouseUp={(e) => this.keyUp(2 + 12 * 4)} onMouseOut={(e) => this.keyUp(2 + 12 * 4)}></td>
                                <td style={(this.pressed(4 + 12 * 4)) ? STYLE.keyWhitePress : STYLE.keyWhite} onMouseOver={(e) => { this.keyOver(e, 4 + 12 * 4) }} onMouseDown={(e) => this.keyDown(4 + 12 * 4, e)} onMouseUp={(e) => this.keyUp(4 + 12 * 4)} onMouseOut={(e) => this.keyUp(4 + 12 * 4)}></td>
                                <td style={(this.pressed(5 + 12 * 4)) ? STYLE.keyWhitePress : STYLE.keyWhite} onMouseOver={(e) => { this.keyOver(e, 5 + 12 * 4) }} onMouseDown={(e) => this.keyDown(5 + 12 * 4, e)} onMouseUp={(e) => this.keyUp(5 + 12 * 4)} onMouseOut={(e) => this.keyUp(5 + 12 * 4)}></td>
                                <td style={(this.pressed(7 + 12 * 4)) ? STYLE.keyWhitePress : STYLE.keyWhite} onMouseOver={(e) => { this.keyOver(e, 7 + 12 * 4) }} onMouseDown={(e) => this.keyDown(7 + 12 * 4, e)} onMouseUp={(e) => this.keyUp(7 + 12 * 4)} onMouseOut={(e) => this.keyUp(7 + 12 * 4)}></td>
                                <td style={(this.pressed(9 + 12 * 4)) ? STYLE.keyWhitePress : STYLE.keyWhite} onMouseOver={(e) => { this.keyOver(e, 9 + 12 * 4) }} onMouseDown={(e) => this.keyDown(9 + 12 * 4, e)} onMouseUp={(e) => this.keyUp(9 + 12 * 4)} onMouseOut={(e) => this.keyUp(9 + 12 * 4)}></td>
                                <td style={(this.pressed(11 + 12 * 4)) ? STYLE.keyWhitePress : STYLE.keyWhite} onMouseOver={(e) => { this.keyOver(e, 11 + 12 * 4) }} onMouseDown={(e) => this.keyDown(11 + 12 * 4, e)} onMouseUp={(e) => this.keyUp(11 + 12 * 4)} onMouseOut={(e) => this.keyUp(11 + 12 * 4)}></td>

                                <td style={(this.pressed(0 + 12 * 5)) ? STYLE.keyWhitePress : STYLE.keyWhite} onMouseOver={(e) => { this.keyOver(e, 0 + 12 * 5) }} onMouseDown={(e) => this.keyDown(0 + 12 * 5, e)} onMouseUp={(e) => this.keyUp(0 + 12 * 5)} onMouseOut={(e) => this.keyUp(0 + 12 * 5)}></td>
                                <td style={(this.pressed(2 + 12 * 5)) ? STYLE.keyWhitePress : STYLE.keyWhite} onMouseOver={(e) => { this.keyOver(e, 2 + 12 * 5) }} onMouseDown={(e) => this.keyDown(2 + 12 * 5, e)} onMouseUp={(e) => this.keyUp(2 + 12 * 5)} onMouseOut={(e) => this.keyUp(2 + 12 * 5)}></td>
                                <td style={(this.pressed(4 + 12 * 5)) ? STYLE.keyWhitePress : STYLE.keyWhite} onMouseOver={(e) => { this.keyOver(e, 4 + 12 * 5) }} onMouseDown={(e) => this.keyDown(4 + 12 * 5, e)} onMouseUp={(e) => this.keyUp(4 + 12 * 5)} onMouseOut={(e) => this.keyUp(4 + 12 * 5)}></td>
                                <td style={(this.pressed(5 + 12 * 5)) ? STYLE.keyWhitePress : STYLE.keyWhite} onMouseOver={(e) => { this.keyOver(e, 5 + 12 * 5) }} onMouseDown={(e) => this.keyDown(5 + 12 * 5, e)} onMouseUp={(e) => this.keyUp(5 + 12 * 5)} onMouseOut={(e) => this.keyUp(5 + 12 * 5)}></td>
                                <td style={(this.pressed(7 + 12 * 5)) ? STYLE.keyWhitePress : STYLE.keyWhite} onMouseOver={(e) => { this.keyOver(e, 7 + 12 * 5) }} onMouseDown={(e) => this.keyDown(7 + 12 * 5, e)} onMouseUp={(e) => this.keyUp(7 + 12 * 5)} onMouseOut={(e) => this.keyUp(7 + 12 * 5)}></td>
                                <td style={(this.pressed(9 + 12 * 5)) ? STYLE.keyWhitePress : STYLE.keyWhite} onMouseOver={(e) => { this.keyOver(e, 9 + 12 * 5) }} onMouseDown={(e) => this.keyDown(9 + 12 * 5, e)} onMouseUp={(e) => this.keyUp(9 + 12 * 5)} onMouseOut={(e) => this.keyUp(9 + 12 * 5)}></td>
                                <td style={(this.pressed(11 + 12 * 5)) ? STYLE.keyWhitePress : STYLE.keyWhite} onMouseOver={(e) => { this.keyOver(e, 11 + 12 * 5) }} onMouseDown={(e) => this.keyDown(11 + 12 * 5, e)} onMouseUp={(e) => this.keyUp(11 + 12 * 5)} onMouseOut={(e) => this.keyUp(11 + 12 * 5)}></td>

                            </tr>
                        </tbody>

                    </table>
                </div>
                {
                    <div style={STYLE.hide}>
                        <MIDISounds
                            ref={(ref) => (this.midiSounds = ref)}
                            appElementName="root"
                            instruments={[this.state.selectedInstrument]}
                        /></div>
                }
            </div >
        );
    }
}