import React from 'react';
import axios from 'axios';
import io from 'socket.io-client';

let socket;

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

  componentWillUnmount() {
    socket.disconnect();
  }

  render() {
    return (
      <div>
        board
      </div>
    );
  }
}