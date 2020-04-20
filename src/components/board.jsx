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
    height: '90px',
    width: '90px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '28px',
    fontWeight: '700',
    borderRadius: '50%'
  },
  questResultDisplay: {
    width: '100%',
    height: '60%',
    fontSize: '30px',
    fontWeight: '600',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  playerList: {
    width: '30%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  playerListHeader: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '24px'
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
  voteTrackerHeader: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '24px'
  },
  voteTracker: {
    height: '100%',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  voteTrackerCircle: {
    width: '60px',
    height: '60px',
    fontSize: '20px',
    fontWeight: '600',
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
  voteHeader: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between'
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
    width: '50%',
    fontSize: 'large'
  },
  voteButtonContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  voteButtonContainerFull: {
    width: '100%',
    height: '100%',
    display: 'flex',
  },
  voteButtonContainerTop: {
    width: '100%',
    height: '70%',
    display: 'flex',
  },
  voteButtonContainerBottom: {
    width: '100%',
    height: '30%',
    display: 'flex',
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
  },
  voteButtonReverse: {
    width: '100%',
    height: '100%',
    fontSize: '30px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
}));

let testBoardData = {
    "missionVoteCount": {
        "SUCCESS": 0,
        "FAIL": 0,
        "REVERSE": 0
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
    "reversalsAllowed": true,
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
  const { missionVoteCount = {}, playersList = [], doubleFail = false, reversalsAllowed = false, voteTrack = 1, missions = [] } = returnedState;

  const missionResultReady = missionVoteCount.SUCCESS > 0 || missionVoteCount.FAIL > 0 || missionVoteCount.REVERSE > 0;
//TODO make questInfo display responsive
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
          <div className={classes.playerListHeader}>King Order</div>
          {playersList.map( (player) => <PlayerListItem playerName={player} />)}
        </div>
        <div className={classes.bottomRightColumn}>
          <div className={classes.voteTrackerContainer}>
            <div className={classes.voteTrackerHeader}>Mission Proposals</div>
            <VoteTracker voteTrack={voteTrack} />
          </div>
          <VoteArea
            submitMissionVote={submitMissionVote}
            toggleShowVoteButtons={toggleShowVoteButtons}
            shouldShowVoteButtons={shouldShowVoteButtons}
            reversalsAllowed={reversalsAllowed}
            missionVotes={missionVoteCount}
            missionResultReady={missionResultReady}
          />
        </div>
      </div>
    </div>
  );
};


function QuestInfoItem (props) {
  const { misNum, misSize, doubleFail, missionData = {} } = props;
  const { missionResult = 'NOT_WENT' } = missionData;

  const classes = useStyles();

  let backgroundColor = 'lightgray';
  let fontColor = 'black'

  if (missionResult === 'FAIL') {
    backgroundColor = '#FF4949';
    fontColor = 'white';
  } else if (missionResult === 'SUCCESS') {
    backgroundColor = '#006FC2';
    fontColor = 'white';
  }

  return (
    <div className={classes.questInfoItem}>
      <div
        className={classes.questInfoItemStatus}
        style={{ backgroundColor, color: fontColor }}
      >
        { misSize }
      </div>
      {(doubleFail && misNum === 3) && <div style={{color: 'red', fontSize: '14px', textAlign: 'center', position: 'absolute', top: '25px'}}>TWO FAILS REQUIRED</div>}
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
  const { submitMissionVote, toggleShowVoteButtons, shouldShowVoteButtons, reversalsAllowed, missionVotes, missionResultReady } = props;

  if (missionResultReady) {
    return (
      <div className={classes.questResultDisplay}>
        <div>{ missionVotes.SUCCESS > 0 && `Success Votes: ${missionVotes.SUCCESS}` }</div>
        <div>{ missionVotes.FAIL > 0 && `Fail Votes: ${missionVotes.FAIL}` }</div>
        <div>{ missionVotes.REVERSE > 0 && `Reversals: ${missionVotes.REVERSE}` }</div>
      </div>
    );
  } else if (shouldShowVoteButtons) {
    return (
      <MissionVote
        submitMissionVote={submitMissionVote}
        toggleShowVoteButtons={toggleShowVoteButtons}
        reversalsAllowed={reversalsAllowed}
      />
    );
  } else {
    return (
      <div className={classes.voteToggleContainer}>
        <button className={classes.voteToggle} onClick={() => props.toggleShowVoteButtons(true)}>Vote Now</button>
      </div>
    );
  }
}

function MissionVote (props) {
  const classes = useStyles();
  return (
    <div className={classes.voteContainer}>
      <div className={classes.voteHeader}>
        Mission Result Vote:
        <div className={classes.voteCancelContainer}>
          <button className={classes.voteCancelButton} onClick={() => props.toggleShowVoteButtons(false)}>Cancel</button>
        </div>
      </div>
      <div className={classes.voteButtonContainer}>
        <div className={props.reversalsAllowed ? classes.voteButtonContainerTop : classes.voteButtonContainerFull}>
          <button className={classes.voteButtonSuccess} onClick={() => props.submitMissionVote('SUCCESS')}>
            Success
          </button>
          <button className={classes.voteButtonFail} onClick={() => props.submitMissionVote('FAIL')}>
            Fail
          </button>
        </div>
        <div className={classes.voteButtonContainerBottom}>
          { props.reversalsAllowed &&
            <button className={classes.voteButtonReverse} onClick={() => props.submitMissionVote('REVERSE')}>
              Reverse
            </button>
          }
        </div>
      </div>
    </div>
  )
}
