const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const app = express();
app.use(express.static(path.join(__dirname, 'build')));

let state = {
  successCount: 0,
  failCount: 0
}

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get('/vote/success', (req, res) => {
  state.successCount = state.successCount + 1;
  res.send({status: 'VOTE_REGISTERED'});
});

app.get('/vote/reject', (req, res) => {
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

app.listen(process.env.PORT || 8080);