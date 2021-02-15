import React, { Component } from 'react';
import { Grid, Button, Typography } from '@material-ui/core';
import CreateRoomPage from './CreateRoomPage';
import MusicPlayer from './MusicPlayer';

export class Room extends Component {
  constructor(props) {
    super(props);
    this.state = {
      votesToSkip: 2,
      guestCanPause: false,
      isHost: false,
      showSettings: false,
      spotifyAuthenticated: false,
      song: {},
    };
    this.roomCode = this.props.match.params.roomCode;
    this.getRoomDetails = this.getRoomDetails.bind(this);

    this.leaveButtonPressed = this.leaveButtonPressed.bind(this);
    this.updateShowSettings = this.updateShowSettings.bind(this);
    this.renderSettings = this.renderSettings.bind(this);
    this.renderSettingsButton = this.renderSettingsButton.bind(this);
    this.authenticateSpotify = this.authenticateSpotify.bind(this);
    this.getCurrentSong = this.getCurrentSong.bind(this);
    this.getRoomDetails();
    // this.getCurrentSong();
  }
  componentDidMount() {
    this.interval = setInterval(this.getCurrentSong, 1000);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  authenticateSpotify() {
    fetch('/spotify/is-authenticated')
      .then((res) => res.json())
      .then((data) => {
        this.setState({
          spotifyAuthenticated: data.status,
        });
        console.log(data);

        if (!data.status) {
          fetch('/spotify/get-auth-url')
            .then((res) => res.json())
            .then((data) => {
              // data.url
              window.location.replace(data.url);
              console.log('Not okay spotify auth');
            });
        }
      });
  }
  getRoomDetails() {
    fetch('/api/get-room' + '?code=' + this.roomCode)
      .then((res) => {
        if (!res.ok) {
          this.props.leaveRoomCallback();
          this.props.history.push('/');
          console.log('Not okay get room');
        }
        return res.json();
      })
      .then((data) => {
        this.setState({
          votesToSkip: data.votes_to_skip,
          guestCanPause: data.guest_can_pause,
          isHost: data.is_host,
        });
        console.log('Room fetched ');
        // console.log(data);

        if (data.is_host) {
          this.authenticateSpotify();
        }
      });
  }
  updateShowSettings(value) {
    this.setState({
      showSettings: value,
    });
  }
  getCurrentSong() {
    fetch('/spotify/current-song')
      .then((response) => {
        if (!response.ok) {
          // console.log('not okay');
          return {};
        } else {
          // console.log(response.json());
          return response.json();
        }
      })
      .then((data) => {
        this.setState({ song: data });
        console.log(data);
      });
  }
  leaveButtonPressed() {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    };
    fetch('/api/leave-room', requestOptions).then((_response) => {
      this.props.leaveRoomCallback();
      this.props.history.push('/');
    });
  }
  renderSettingsButton() {
    return (
      <Grid item xs={12} align="center">
        <Button
          variant="contained"
          color="primary"
          onClick={() => this.updateShowSettings(true)}
        >
          Settings
        </Button>
      </Grid>
    );
  }
  renderSettings() {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <CreateRoomPage
            update={true}
            votesToSkip={this.state.votesToSkip}
            guestCanPause={this.state.guestCanPause}
            roomCode={this.roomCode}
            updateCallback={this.getRoomDetails}
          />
        </Grid>

        <Grid item xs={12} align="center">
          <Button
            color="secondary"
            variant="contained"
            onClick={() => this.updateShowSettings(false)}
          >
            Close
          </Button>
        </Grid>
      </Grid>
    );
  }
  render() {
    if (this.state.showSettings) {
      return this.renderSettings();
    }
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Typography variant="h4" component="h4">
            Code: {this.roomCode}
          </Typography>
        </Grid>
        <MusicPlayer {...this.state.song} />
        {this.state.isHost ? this.renderSettingsButton() : null}
        <Grid item xs={12} align="center">
          <Button
            color="secondary"
            variant="contained"
            onClick={this.leaveButtonPressed}
          >
            Leave Room
          </Button>
        </Grid>
      </Grid>
    );
  }
}

export default Room;
