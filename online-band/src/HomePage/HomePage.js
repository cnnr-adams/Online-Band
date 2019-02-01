import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
export default class HomePage extends Component {

    constructor(props) {
        super(props);
        this.state = { roomId: '' };
    }
    render() {
        return (
            <div className="homePage">
                <input type="text" value={this.state.roomId} onChange={(event) => {
                    this.setState({ roomId: event.target.value });
                }} />
                <Button variant="primary" onClick={() => this.props.join(this.state.roomId)}>Join Game</Button>
                <Button variant="secondary" onClick={this.props.host}>Host Game</Button>
            </div>
        )
    }
}