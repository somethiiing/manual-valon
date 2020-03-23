import React from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { makeStyles } from '@material-ui/core/styles';

let socket;

const useStyles = makeStyles(theme => ({
  gameboard: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  gameInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    height: '80%',
  },
  questInfo: {
    width: '65%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  questInfoItem: {
    display: 'flex',
    height: '20%',
    borderBottom: '1px solid gray',
    '&:last-child': {
      borderBottom: 'none'
    }
  },
  questInfoItemData: {
    width: '35%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  questInfoItemStatus: {
    width: '65%',
    borderLeft: '1px solid black',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '28px',
    fontWeight: '700'
  },
  playerList: {
    borderLeft: '1px solid black',
    width: '35%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'

  },
  playerListHeader: {
    borderBottom: '1px solid gray'
  },
  playerListItem: {
    display: 'flex',
    borderBottom: '1px solid gray',
    height: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
    '&:last-child': {
      borderBottom: 'none'
    }
  },
  playerListName: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center'
  },
  roomInfo: {
    height: '20%',
    borderTop: '1px solid black'
  },
  roomInfo_subheader: {
    fontWeight: 500
  },
  roomInfo_block: {
    width: '150px',
    display: 'flex',
    justifyContent: 'space-between'
  },
  roomInfo_extendedBlock: {
    width: '500px',
    display: 'flex',
    justifyContent: 'space-between'
  },
  bottomSection: {
    width: '100%',
    height: '20%',
    display: 'flex'
  },
  voteTrackerContainer: {
    width: '65%',
    height: '100%'
  },
  voteTracker: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-around'
  },
  voteTrackerCircle: {
    width: '40px',
    height: '40px',
    backgroundColor: 'lightgray',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '&:last-child': {
      backgroundColor: '#FF4949'
    }
  },
  selectedCircle: {
    border: 'solid 4px black'
  },
  voteContainer: {
    width: '35%',
    height: '100%'
  },
  voteButtonContainer: {
    width: '100%',
    height: '80%',
    display: 'flex'
  },
  voteButtonSuccess: {
    width: '50%',
    height: '100%',
    backgroundColor: '#006FC2',
    color: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  voteButtonFail: {
    width: '50%',
    height: '100%',
    backgroundColor: '#FF4949',
    color: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
}));

//TODO 'configuring' page whie waiting for missionSize to be set

let testState = {
    "missionSize": "3,4,4,4,5",
    "doubleFail": false,
    "voteTrack": 1,
    "selectedMission": 1,
    "missionResult": "SUCCESS",
    "returnedState": {
        "missionVoteCount": {
            "SUCCESS": 0,
            "FAIL": 0
        },
        "playersList": [
            "elliot",
            "charlie",
            "alice",
            "david",
            "bob"
        ],
        "doubleFail": true,
        "voteTrack": 3,
        "missions": [
            {
                "missionSize": "3",
                "missionResult": "SUCCESS"
            },
            {
                "missionSize": "4",
                "missionResult": "NOT_WENT"
            },
            {
                "missionSize": "4",
                "missionResult": "NOT_WENT"
            },
            {
                "missionSize": "4",
                "missionResult": "NOT_WENT"
            },
            {
                "missionSize": "5",
                "missionResult": "NOT_WENT"
            }
        ]
    }
}

export default class Board extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      boardData: testState
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
    console.log(this.state)
    return (
      <GameBoard
        missionSizes={this.state.boardData.missionSize.split(',')}
        currentVoteTrack={this.state.boardData.voteTrack}
        selectedMission={this.state.boardData.selectedMission}
        currentMissionResult={this.state.boardData.missionResult}
        returnedState={this.state.boardData.returnedState}
        submitMissionVote={this.submitMissionVote}
      />
    );
  }
}


function GameBoard (props) {
  const classes = useStyles();
  const { missionSizes = [], currentVoteTrack = '1', selectedMission = '1',
    currentMissionResult = 'NOT_WENT', returnedState = {}, submitMissionVote } = props;
  const { missionVoteCount = {}, playersList = [], doubleFail = false, voteTrack = 1, missions = [] } = returnedState;

  return (
    <div className={classes.gameboard}>
      <div className={classes.gameInfo}>
        <div className={classes.questInfo}>
          {missionSizes.map( (misSize, ind) =>
            <QuestInfoItem
              misNum={ind}
              misSize={misSize}
              doubleFail={doubleFail}
              missionData={missions[ind]}
            />
          )}
        </div>

        <div className={classes.playerList}>
          <div className={classes.playerListHeader}>King Order: </div>
          {playersList.map( (player) => <PlayerListItem playerName={player} />)}
        </div>
      </div>
      <div className={classes.bottomSection}>
        <div className={classes.voteTrackerContainer}>
          <div className={classes.voteTrackerHeader}>Mission Proposals: </div>
          <VoteTracker voteTrack={voteTrack} />
        </div>
        <div className={classes.voteContainer}>
          <div className={classes.voteHeader}>Mission Result Vote: </div>
          <MissionVote submitMissionVote={submitMissionVote}/>
        </div>
      </div>
    </div>
  );
};


function QuestInfoItem (props) {
  let backgroundColor = 'lightgray';
  let fontColor = 'black'

  const classes = useStyles();
  const { misNum, misSize, doubleFail, missionData = {} } = props;
  const { status = 'NOT_WENT' } = missionData;

  const statusDisplay = status === 'NOT_WENT' ? misSize.toString() : status;

  if (status !== 'NOT_WENT') {
    backgroundColor = status === 'fail' ? '#FF4949' : '#006FC2'
    fontColor = 'white';
  }

  return (
    <div className={classes.questInfoItem}>
      <div className={classes.questInfoItemData}>
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <div style={{fontWeight: 800}}>Quest {misNum + 1}:</div>
          <div style={{}}>Size: {misSize}</div>
        </div>
        {(doubleFail && misNum === 3) && <div style={{color: 'red'}}> TWO FAILS REQUIRED</div>}
      </div>
      <div
        className={classes.questInfoItemStatus}
        style={{ backgroundColor, color: fontColor }}
      >
        { statusDisplay.toUpperCase() }
      </div>
    </div>
  );
}


function PlayerListItem (props) {
  const classes = useStyles();

  return (
    <div className={classes.playerListItem}>
      <div className={classes.playerListName}>{props.playerName}</div>
    </div>
  )
};


function VoteTracker (props) {
  const classes = useStyles();
  const circles = [];
  for (let i=1; i<=5; i++) {
    circles.push(<div className={`${classes.voteTrackerCircle} ${props.voteTrack === i && classes.selectedCircle}`}>{i}</div>);
  }
  return (
    <div className={classes.voteTracker}>
      {circles}

    </div>
  )
}

function MissionVote (props) {
  const classes = useStyles();

  return (
    <div className={classes.voteButtonContainer}>
      <div className={classes.voteButtonSuccess} onClick={() => props.submitMissionVote('SUCCESS')}>
        Success
      </div>
      <div className={classes.voteButtonFail} onClick={() => props.submitMissionVote('FAIL')}>
        Fail
      </div>
    </div>
  )
}
