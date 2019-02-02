import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import BandPage from './BandPage/BandPage';
import HomePage from './HomePage/HomePage';
import Backend from './interface';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = { connected: false };
    this.backend = new Backend(this.onConnect, this.onDisconnect);
  }
  componentDidMount() {

  }
  onConnect = (lobbyId) => {
    this.setState({ connected: true, lobbyId: lobbyId });
  }
  onDisconnect = () => {
    this.setState({ connected: false });
  }

  render() {
    if (!this.state.connected) {
      return (
        <HomePage host={this.backend.host} join={this.backend.join} />
      )
    }
    return (
      <BandPage lobbyId={this.state.lobbyId} backend={this.backend} />
    );
  }
}