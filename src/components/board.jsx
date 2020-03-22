import React from 'react';
import axios from 'axios';
import io from 'socket.io-client';

let socket;

let state = {
  missionVoteCount: {
    SUCCESS: 0,
    FAIL: 0
  },
  doubleFail: false,
  voteTrack: 1,
  missions: [
    {missionSize: 3, missionResult: 'NOT_WENT'} // result === NOT_WENT, SUCCESS, FAIL
  ]
}

export default class Board extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      boardData: {}
    };
  }

  componentDidMount() {
    axios.get('/getData')
      .then( res => {
        this.setState({boardData: res.data})
      })

    socket = io('/');

    socket.on('updateBoard', boardData => this.updateBoardData(boardData));
  }

  updateBoardData(data) {
    this.setState({boardData: data});
    console.log('got it!', data)
  }

  submitMissionVote(vote) {
    // vote needs to be either 'SUCCESS' or 'FAIL'
    axios.post('/submitMissionVote', {vote});
  }

  componentWillUnmount() {
    socket.disconnect();
  }

  render() {
    // mission numbers + doublefail, mission statuses, player order,
    // mission vote buttons, vote tracker, mission vote results,
    return (
      <div>
        board
      </div>
    );
  }
}