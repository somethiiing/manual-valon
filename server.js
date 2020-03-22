const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT);
const io = require('socket.io').listen(server);

const { setMissionSizes } = require('./serverUtils');

app
  .use(bodyParser.urlencoded({ extended: false }))
  .use(bodyParser.json())
  .use(express.static(path.join(__dirname, 'build')));

let state = {
  voteCount: {
    SUCCESS: 0,
    FAIL: 0
  },
  nominationVote: [],
  doubleFail: false,
  voteTrack: 1,
  missions: []
}

app.get('/viewState', (req, res) => {
  res.send(state);
});

app.get('/getData', (req, res) => {
  res.send({status: 'DATA_SENT', state})
});

app.post('/submitMissionVote', (req, res) => {
  let { vote } = req.body;
  state.voteCount[vote] = state.voteCount[vote] + 1;
  res.send({status: 'VOTE_REGISTERED'});
});

app.post('/submitMissionVoteReset', (req, res) => {
  state.voteCount = {
    SUCCESS: 0,
    FAIL: 0
  }
  res.send({status: 'STATE_RESET'});
});

app.post('/submitBoardChange', (req, res) => {
  const { changeType, missionSize, doubleFail, voteTrack, selectedMission, missionResult } = req.body
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