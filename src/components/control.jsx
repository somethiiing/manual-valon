import React from 'react';
import axios from 'axios';

export default class ControlPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      players: '',
      missionSize: '',
      doubleFail: false,
      reversalsAllowed: false,
      voteTrack: 1,
      voteStatus: 'BLANK',
      selectedMission: 1,
      missionResult: 'SUCCESS',
      showDisplay: true,
      returnedState: {},
      missionVote: {}
    }

    this.onInputChange = this.onInputChange.bind(this);
    this.submitBoardChange = this.submitBoardChange.bind(this);
    this.incrementMissionProposal = this.incrementMissionProposal.bind(this);
    this.submitMissionVote = this.submitMissionVote.bind(this);
    this.revealMissionVotes = this.revealMissionVotes.bind(this);
    this.submitMissionVoteReset = this.submitMissionVoteReset.bind(this);
    this.toggleDisplay = this.toggleDisplay.bind(this);
  }

  onInputChange(e, field, numOrBool) {
    let temp = {};
    if(numOrBool === 'num') {
      temp[field] = Number(e.target.value);
    } else if (numOrBool === 'bool') {
      temp[field] = Boolean(e.target.value);
    } else {
      temp[field] = e.target.value
    }
    this.setState(temp);
  }

  submitBoardChange(e, form) {
    e.preventDefault();
    let data = {};
    if(form === 'setPlayersList') {
      data.changeType = 'SET_PLAYERS_LIST';
      data.playersList = this.state.players.split(',');
    }
    if(form === 'setMissionSize') {
      data.changeType = 'SET_MISSION_SIZE';
      data.missionSize = this.state.missionSize.split(',');
      data.doubleFail = this.state.doubleFail;
    }
    if(form === 'setSpecialOptions') {
      data.changeType = 'SET_SPECIAL_OPTIONS';
      data.reversalsAllowed = this.state.reversalsAllowed;
    }
    if(form === 'setVoteTrack') {
      data.changeType = 'SET_VOTE_TRACK';
      data.voteTrack = this.state.voteTrack;
    }
    if(form === 'setVoteStatus') {
      data.changeType = 'SET_VOTE_STATUS';
      data.voteStatus = this.state.voteStatus;
    }
    if(form === 'setMissionResult') {
      data.changeType = 'SET_MISSION_RESULT';
      data.selectedMission = this.state.selectedMission;
      data.missionResult = this.state.missionResult;
    }

    axios.post('/submitBoardChange', data)
    .then( res => this.setState({returnedState: res.data}));
  }

  incrementMissionProposal() {
    let data = {};
    const newVoteTrack = this.state.voteTrack + 1 > 5 ? 5 : this.state.voteTrack + 1;
    data.changeType = 'NEXT_PROPOSAL';
    data.voteTrack = newVoteTrack;
    this.setState({voteTrack: newVoteTrack});
    axios.post('/submitBoardChange', data)
    .then( res => this.setState({returnedState: res.data}));
  }

  missionFinished(result) {
    const nextMission = this.state.returnedState.missions.findIndex(m => m.missionResult === 'NOT_WENT') + 1;
    let data = {};
    data.changeType = 'MISSION_FINISHED';
    data.voteTrack = 1;
    data.selectedMission = nextMission;
    data.missionResult = result;
    this.setState({
      voteTrack: 1,
      missionResult: result
    });//TODO sync up state with dropdowns or reference returnedState instead to increment
    axios.post('/submitBoardChange', data)
    .then( res => this.setState({returnedState: res.data}));
  }

  openMissionVoting() {
    axios.post('/openMissionVoting')
    .then( res => this.setState({returnedState: res.data.state, missionVote: res.data.missionVoteCount}))
  }

  submitMissionVote(vote) {
    axios.post('/submitMissionVote', {vote})
    .then(res => this.setState({missionVote: res.data}));
  }

  revealMissionVotes() {
    axios.post('/revealMissionVotes');
  }

  submitMissionVoteReset() {
    axios.post('/submitMissionVoteReset')
    .then( res => this.setState({returnedState: res.data.state, missionVote: res.data.missionVoteCount}))
  }

  toggleDisplay() {
    this.setState({showDisplay: !this.state.showDisplay});
  }
//TODO votes received counter
  render() {
    return (
      <div style={{display:'flex', height: '100%'}}>
        <div style={{padding: '25px', width: '50%'}}>
          <button onClick={this.incrementMissionProposal}>NEXT PROPOSAL</button>
          <button onClick={this.openMissionVoting}>OPEN VOTING</button>
          <button onClick={this.revealMissionVotes}>REVEAL MISSION VOTE</button>
          <button onClick={() => this.missionFinished('SUCCESS')}>MISSION SUCCEEDED</button>
          <button onClick={() => this.missionFinished('FAIL')}>MISSION FAILED</button>
          <button onClick={this.submitMissionVoteReset}>RESET MISSION VOTE</button>
          <form
            style={{display: 'flex', flexDirection: 'column'}}
            onSubmit={e => this.submitBoardChange(e, 'setPlayersList')}
          >
            <h4>Submit Players</h4>
            <input
              placeholder='alice,bob,charlie,david,elliot'
              value={this.state.players}
              onChange={ (e) => this.onInputChange(e, 'players') }
            ></input>
            <button>SUBMIT PLAYERS LIST</button>
          </form>

          <form style={{display: 'flex', flexDirection: 'column'}}
            onSubmit={e => this.submitBoardChange(e, 'setMissionSize')}
          >
            <h4>Set Mission Sizes:</h4>
            <input
              placeholder='3,4,4,4,5'
              value={this.state.missionSize}
              onChange={ (e) => this.onInputChange(e, 'missionSize') }
            ></input>
            <div>
              <label>Double Fail Required:</label>
              <select onChange={ e => {this.onInputChange(e, 'doubleFail', 'bool')}} >
                <option value={''}>false</option>
                <option value={true}>true</option>
              </select>
            </div>

            <button>SET MISSION SIZES</button>
          </form>

          <form style={{display: 'flex', flexDirection: 'column'}}
            onSubmit={e => this.submitBoardChange(e, 'setSpecialOptions')}
          >
            <h4>Set Special Options:</h4>
            <div>
              <label>Play with Reversals:</label>
              <select onChange={ e => {this.onInputChange(e, 'reversalsAllowed', 'bool')}} >
                <option value={''}>false</option>
                <option value={true}>true</option>
              </select>
            </div>

            <button>SET SPECIAL OPTIONS</button>
          </form>

          <form style={{display: 'flex', flexDirection: 'column'}}
            onSubmit={e => this.submitBoardChange(e, 'setVoteTrack')}
          >
            <h4>Set Vote Track:</h4>
            <div>
              <label>Vote Track:</label>
              <select onChange={ e => {this.onInputChange(e, 'voteTrack', 'num')}} >
                {[1,2,3,4,5].map( num => {
                  return <option value={num}>{num}</option>
                })}
              </select>
            </div>

            <button>SET VOTE TRACK</button>
          </form>

          <form style={{display: 'flex', flexDirection: 'column'}}
            onSubmit={e => this.submitBoardChange(e, 'setVoteStatus')}
          >
            <h4>Set Vote Status:</h4>
            <div>
              <label>Vote Status:</label>
              <select onChange={ e => {this.onInputChange(e, 'voteStatus')}} >
                {['BLANK', 'VOTING_READY', 'DISPLAY_RESULT'].map( el => {
                  return <option value={el}>{el}</option>
                })}
              </select>
            </div>

            <button>SET VOTE STATUS</button>
          </form>

          <form style={{display: 'flex', flexDirection: 'column'}}
            onSubmit={this.submitBoardChange}
          >
            <h4>Mission Vote:</h4>
            <button onClick={ () => this.submitMissionVote('SUCCESS')}>VOTE SUCCESS</button>
            <button onClick={ () => this.submitMissionVote('FAIL')}>VOTE FAIL</button>
            <button onClick={this.revealMissionVotes}>REVEAL MISSION VOTE</button>
            <button onClick={this.submitMissionVoteReset}>RESET MISSION VOTE</button>
          </form>

          <form style={{display: 'flex', flexDirection: 'column'}}
            onSubmit={e => this.submitBoardChange(e, 'setMissionResult')}
          >
            <h4>Set Mission Result:</h4>
            <div>
              <label>Mission Num:</label>
              <select onChange={ e => {this.onInputChange(e, 'selectedMission', 'num')}} >
                {[1,2,3,4,5].map( num => {
                  return <option value={num}>{num}</option>
                })}
              </select>
            </div>
            <div>
            <label>Mission Outcome:</label>
              <select onChange={ e => {this.onInputChange(e, 'missionResult')}} >
                {['SUCCESS', 'FAIL', 'NOT_WENT'].map( el => {
                  return <option value={el}>{el}</option>
                })}
              </select>
            </div>
            <button>SET MISSION OUTCOME</button>
          </form>

        </div>

        <div style={{width: '50%', borderLeft: '1px solid black', paddingLeft: '25px'}}>
          <button onClick={this.toggleDisplay}>Toggle Display</button>
          { this.state.showDisplay && <pre>{JSON.stringify(this.state, null, 4)}</pre>}
        </div>

      </div>
    );
  }
}
