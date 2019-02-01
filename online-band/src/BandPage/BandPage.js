import React, { Component } from 'react';
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
        return (
            <div className="bandPage">
                Users connected: {this.state.length} at {this.state.lobbyId}
            </div>
        )
    }
}