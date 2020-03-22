const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT);
const io = require('socket.io').listen(server);

const { setMissionSizes, shuffle } = require('./serverUtils');

app
  .use(bodyParser.urlencoded({ extended: false }))
  .use(bodyParser.json())
  .use(express.static(path.join(__dirname, 'build')));

let state = {
  missionVoteCount: {
    SUCCESS: 0,
    FAIL: 0
  },
  playersList: [],
  doubleFail: false,
  voteTrack: 1,
  missions: []
}

let missionVoteCount = {
  SUCCESS: 0,
  FAIL: 0
}

app.get('/viewState', (req, res) => {
  res.send(state);
});

app.get('/getData', (req, res) => {
  io.emit('updateBoard', state);
  res.send({status: 'DATA_SENT', state})
});

app.post('/submitMissionVote', (req, res) => {
  let { vote } = req.body;
  missionVoteCount[vote] = missionVoteCount[vote] + 1;
  res.send({status: 'VOTE_REGISTERED', missionVoteCount});
});

app.post('/revealMissionVotes', (req, res) => {
  state.missionVoteCount = missionVoteCount;
  io.emit('updateBoard', state);
  res.send({missionVoteCount});
})

app.post('/submitMissionVoteReset', (req, res) => {
  state.missionVoteCount = {
    SUCCESS: 0,
    FAIL: 0
  }
  missionVoteCount = {
    SUCCESS: 0,
    FAIL: 0
  }
  io.emit('updateBoard', state);
  res.send({status: 'STATE_RESET', state, missionVoteCount});
});

app.post('/submitBoardChange', (req, res) => {
  const { changeType, missionSize, doubleFail, voteTrack,
    selectedMission, missionResult, playersList
  } = req.body
  if (changeType === 'SET_PLAYERS_LIST') {
    state.playersList = shuffle(playersList);
  }
  if (changeType === 'SET_MISSION_SIZE') {
    state.missions = setMissionSizes(missionSize);
    state.doubleFail = doubleFail;
  }
  if (changeType === 'SET_VOTE_TRACK') {
    state.voteTrack = voteTrack;
  }
  if (changeType === 'SET_MISSION_RESULT') {
    state.missions[selectedMission - 1].setMissionResult(missionResult);
  }

  io.emit('updateBoard', state);
  res.send(state);
})

io.on('connection', socket => {
  console.log('a user connected');
  socket.on('disconnect', testdata => {
    console.log('user disconnected')
  });
});

console.log(`listening on port: ${PORT}`);