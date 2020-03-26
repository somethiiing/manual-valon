import React from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { makeStyles } from '@material-ui/core/styles';

let socket;

const useStyles = makeStyles(theme => ({
  gameNotReady: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '28px'
  },
  gameboard: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  gameInfo: {
    display: 'flex',
    flexDirection: 'column',
    height: '30%',
  },
  questInfo: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'space-around'
  },
  questInfoItem: {
    width: '20%',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  questInfoItemData: {
    width: '35%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  questInfoItemStatus: {
    height: '70px',
    width: '70px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '28px',
    fontWeight: '700',
    borderRadius: '50%'
  },
  questResultDisplay: {
    fontSize: '16px',
    fontWeight: '500',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  playerList: {
    width: '30%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  playerListHeader: {
  },
  playerListItem: {
    display: 'flex',
    height: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
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
    height: '70%',
    display: 'flex'
  },
  bottomRightColumn: {
    height: '100%',
    width: '70%'
  },
  voteTrackerContainer: {
    width: '100%',
    height: '40%',
    display: 'flex',
    flexDirection: 'column',
  },
  voteTracker: {
    height: '100%',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center'
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
    width: '100%',
    height: '60%',
    display: 'flex',
    flexDirection: 'column'
  },
  voteToggleContainer: {
    width: '100%',
    height: '60%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  voteToggle: {
    height: '30%',
    width: '50%'
  },
  voteButtonContainer: {
    width: '100%',
    height: '100%',
    display: 'flex'
  },
  voteButtonSuccess: {
    width: '50%',
    height: '100%',
    backgroundColor: '#006FC2',
    color: 'white',
    fontSize: '30px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  voteButtonFail: {
    width: '50%',
    height: '100%',
    backgroundColor: '#FF4949',
    color: 'white',
    fontSize: '30px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
}));

let testBoardData = {
    "missionVoteCount": {
        "SUCCESS": 0,
        "FAIL": 0
    },
    "playersList": [
        "elliot",
        "charlie",
        "isaac",
        "george",
        "alice",
        "david",
        "harry",
        "bob",
        "fred",
        "john"
    ],
    "doubleFail": true,
    "voteTrack": 1,
    "missions": [
        {
            "missionSize": "3",
            "missionResult": "SUCCESS"
        },
        {
            "missionSize": "4",
            "missionResult": "FAIL"
        },
        {
            "missionSize": "4",
            "missionResult": "NOT_WENT"
        },
        {
            "missionSize": "5",
            "missionResult": "NOT_WENT"
        },
        {
            "missionSize": "5",
            "missionResult": "NOT_WENT"
        }
    ]
}

export default class Board extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      boardData: testBoardData,
      shouldShowVoteButtons: false
    };

     this.updateBoardData = this.updateBoardData.bind(this);
     this.toggleShowVoteButtons = this.toggleShowVoteButtons.bind(this);
     this.submitMissionVote = this.submitMissionVote.bind(this);
  }

  componentDidMount() {
    axios.get('/getData')
      .then( res => {
        console.log('got initial data', res.data.state)
        this.setState({boardData: res.data.state})
      })

    socket = io('/');

    socket.on('updateBoard', boardData => this.updateBoardData(boardData));
  }

  updateBoardData(data) {
    this.setState({boardData: data});
  }

  toggleShowVoteButtons(shouldShowVoteButtons) {
    this.setState({shouldShowVoteButtons: shouldShowVoteButtons});
  }

  submitMissionVote(vote) {
    // vote needs to be either 'SUCCESS' or 'FAIL'
    axios.post('/submitMissionVote', {vote});
    this.toggleShowVoteButtons(false);
  }

  componentWillUnmount() {
    socket.disconnect();
  }

  render() {
    console.log('state', this.state)
    const gameStarted = this.state.boardData.missions.length !== 0;

    return (
      <div style={{height: '100%', width: '100%'}}>
        { gameStarted ?
          <GameBoard
            returnedState={this.state.boardData}
            submitMissionVote={this.submitMissionVote}
            toggleShowVoteButtons={this.toggleShowVoteButtons}
            shouldShowVoteButtons={this.state.shouldShowVoteButtons}
          /> :
          <WaitForAdmin />
        }
      </div>
    );
  }
}

function WaitForAdmin (props) {
  const classes = useStyles();
  return (
    <div className={classes.gameNotReady}>
      Please wait. The admin is currently configuring your room.
    </div>
  );
}

function GameBoard (props) {
  const classes = useStyles();
  const { returnedState = {}, submitMissionVote, toggleShowVoteButtons, shouldShowVoteButtons = false } = props;
  const { missionVoteCount = {}, playersList = [], doubleFail = false, voteTrack = 1, missions = [] } = returnedState;

  const nextMission = missions.findIndex(mission => mission.missionResult === 'NOT_WENT');
  const missionResultReady = missionVoteCount.SUCCESS > 0 || missionVoteCount.FAIL > 0;

  return (
    <div className={classes.gameboard}>
      <div className={classes.gameInfo}>
        <div className={classes.questInfo}>
          {missions.map( (mission, ind) =>
            <QuestInfoItem
              misNum={ind}
              misSize={mission.missionSize}
              doubleFail={doubleFail}
              missionData={mission}
            />
          )}
        </div>
      </div>
      <div className={classes.bottomSection}>
        <div className={classes.playerList}>
          <div className={classes.playerListHeader}>King Order: </div>
          {playersList.map( (player) => <PlayerListItem playerName={player} />)}
        </div>
        <div className={classes.bottomRightColumn}>
          <div className={classes.voteTrackerContainer}>
            <div className={classes.voteTrackerHeader}>Mission Proposals: </div>
            <VoteTracker voteTrack={voteTrack} />
          </div>
          <VoteArea
            submitMissionVote={submitMissionVote}
            toggleShowVoteButtons={toggleShowVoteButtons}
            shouldShowVoteButtons={shouldShowVoteButtons}
            missionVotes={missionVoteCount}
            missionResultReady={missionResultReady}
          />
        </div>
      </div>
    </div>
  );
};


function QuestInfoItem (props) {
  let backgroundColor = 'lightgray';
  let fontColor = 'black'

  const classes = useStyles();
  const { misNum, misSize, doubleFail, missionData = {}, missionVotes } = props;
  const { missionResult = 'NOT_WENT' } = missionData;

  if (missionResult !== 'NOT_WENT') {
    backgroundColor = missionResult === 'FAIL' ? '#FF4949' : '#006FC2'
    //TODO set backgroundColor back to gray after accidental status change and back to NOT_WENT
    fontColor = 'white';
  }
  //TODO center/style section titles
  //TODO center the double fail mission circle
  return (
    <div className={classes.questInfoItem}>
      <div
        className={classes.questInfoItemStatus}
        style={{ backgroundColor, color: fontColor }}
      >
        { misSize }
      </div>
      {(doubleFail && misNum === 3) && <div style={{color: 'red', fontSize: '14px', textAlign: 'center'}}>TWO FAILS REQUIRED</div>}
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

function VoteArea (props) {
  const classes = useStyles();
  const { submitMissionVote, toggleShowVoteButtons, shouldShowVoteButtons, missionVotes, missionResultReady } = props;

  if (missionResultReady) {
    return (
      <div className={classes.questResultDisplay}>
        <div>{ missionVotes.SUCCESS > 0 && `Success Votes: ${missionVotes.SUCCESS}` }</div>
        <div>{ missionVotes.FAIL > 0 && `Fail Votes: ${missionVotes.FAIL}` }</div>
      </div>
    );
  } else if (shouldShowVoteButtons) {
    return (
      <MissionVote submitMissionVote={submitMissionVote} />
    );
  } else {
    return (
      <VoteToggle toggleShowVoteButtons={toggleShowVoteButtons} />
    );
  }
}

function VoteToggle (props) {
  const classes = useStyles();

  return (
    <div className={classes.voteToggleContainer}>
      <button className={classes.voteToggle} onClick={() => props.toggleShowVoteButtons(true)}>Vote Now</button>
    </div>
  );
}

function MissionVote (props) {
  const classes = useStyles();
  //TODO add 'cancel' toggle button to hide vote buttons - reuse VoteToggle with 'text' prop
  return (
    <div className={classes.voteContainer}>
      <div className={classes.voteHeader}>Mission Result Vote: </div>
      <div className={classes.voteButtonContainer}>
        <button className={classes.voteButtonSuccess} onClick={() => props.submitMissionVote('SUCCESS')}>
          Success
        </button>
        <button className={classes.voteButtonFail} onClick={() => props.submitMissionVote('FAIL')}>
          Fail
        </button>
      </div>
    </div>
  )
}
