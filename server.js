const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'build')));

let state = {
  successCount: 0,
  failCount: 0
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get('/getData', (req, res) => {
  res.send({status: 'DATA_SENT', state})
})

app.get('/vote/success', (req, res) => {
  state.successCount = state.successCount + 1;
  res.send({status: 'VOTE_REGISTERED'});
});

app.get('/vote/fail', (req, res) => {
  state.failCount = state.failCount + 1;
  res.send({status: 'VOTE_REGISTERED'});
})

app.get('/reset', (req, res) => {
  state = {
    successCount: 0,
    failCount: 0
  }
  res.send({status: 'STATE_RESET'});
})

app.listen(port, () => console.log('listening on port: 3000'));