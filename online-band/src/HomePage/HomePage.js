import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import './HomePage.css';

export default class HomePage extends Component {

    constructor(props) {
        super(props);
        this.state = { roomId: '', username: '' };
    }
    render() {
        return (
            <div className="homePage">
                <div className="content">
                    <input type="text" value={this.state.username} placeholder="Username" onChange={(event) => {
                        this.setState({ username: event.target.value });
                    }} />
                    <h1>Online Band</h1>
                    <input type="text" value={this.state.roomId} placeholder="Room number" onChange={(event) => {
                        this.setState({ roomId: event.target.value });
                    }} />

                    <Button className="host" onClick={() => this.props.host(this.state.username, this.props.defaultVolume, this.props.defaultInstrument)}>Host</Button>
                    <Button className="join" onClick={() => this.props.join(this.state.roomId, this.state.username, this.props.defaultVolume, this.props.defaultInstrument)}>Join</Button>
                </div>
                <div className="footer">
                    Connor, Caelan, Ryan, Dima
                </div>
            </div>
        )
    }
}