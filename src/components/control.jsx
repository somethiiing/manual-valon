import React from 'react';
import axios from 'axios';

export default class ControlPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      missionSize: '',
      doubleFail: false,
      voteTrack: 1,
      selectedMission: 1,
      missionResult: 'SUCCESS',
      returnedState: {}
    }

    this.onInputChange = this.onInputChange.bind(this);
    this.submitBoardChange = this.submitBoardChange.bind(this);
    this.submitMissionVote = this.submitMissionVote.bind(this);
    this.submitMissionVoteReset = this.submitMissionVoteReset.bind(this);
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
    if(form === 'setMissionSize') {
      data.changeType = 'SET_MISSION_SIZE';
      data.missionSize = this.state.missionSize.split(',');
      data.doubleFail = this.state.doubleFail;
    }
    if(form === 'setVoteTrack') {
      data.changeType = 'SET_VOTE_TRACK';
      data.voteTrack = this.state.voteTrack;
    }
    if(form === 'setMissionResult') {
      data.changeType = 'SET_MISSION_RESULT';
      data.selectedMission = this.state.selectedMission;
      data.missionResult = this.state.missionResult;
    }

    axios.post('/submitBoardChange', data)
    .then( res => this.setState({returnedState: res.data}));
  }

  submitMissionVote(vote) {
    axios.post('/submitMissionVote', {vote})
    .then (res => this.setState({returnedState: res.data}));
  }

  submitMissionVoteReset() {
    axios.post('/submitMissionVoteReset')
    .then( res => this.setState({returnedState: res.data}))
  }

  render() {
    return (
      <div style={{display:'flex', height: '100%'}}>
        <div style={{padding: '25px', width: '50%'}}>
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
            onSubmit={this.submitBoardChange}
          >
            <h4>Mission Vote:</h4>
            <button onClick={ () => this.submitMissionVote('SUCCESS')}>VOTE SUCCESS</button>
            <button onClick={ () => this.submitMissionVote('FAIL')}>VOTE FAIL</button>
            <button  onClick={this.submitMissionVoteReset}>RESET MISSION VOTE</button>
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
                {['SUCCESS', 'FAILURE', 'NOT GONE'].map( el => {
                  return <option value={el}>{el}</option>
                })}
              </select>
            </div>
            <button>SET MISSION OUTCOME</button>
          </form>

        </div>

        <div style={{width: '50%', borderLeft: '1px solid black', paddingLeft: '25px'}}>
          <pre>{JSON.stringify(this.state, null, 4)}</pre>
        </div>

      </div>
    );
  }
}