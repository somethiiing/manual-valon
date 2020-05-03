import React from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

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
    justifyContent: 'space-between',
    maxWidth: '1000px',
    margin: 'auto'
  },
  gameInfo: {
    display: 'flex',
    flexDirection: 'column',
    height: '30%',
    [theme.breakpoints.down('xs')]: {
      height: '20%'
    }
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
    alignItems: 'center',
    [theme.breakpoints.down('xs')]: {
      padding: '5px'
    }
  },
  questInfoItemCircle: {
    height: '90px',
    width: '90px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '28px',
    fontWeight: '700',
    borderRadius: '50%',
    [theme.breakpoints.down('xs')]: {
      height: '50px',
      width: '50px',
      fontSize: '20px',
      fontWeight: '500'
    }
  },
  doubleFail: {
    color: 'red',
    fontSize: '14px',
    textAlign: 'center',
    position: 'absolute',
    top: '25px',
    [theme.breakpoints.down('xs')]: {
      top: '10px'
    }
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
    width: '25%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    margin: 'auto'
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
    display: 'flex',
    [theme.breakpoints.down('xs')]: {
      height: '80%'
    }
  },
  bottomRightColumn: {
    height: '100%',
    width: '75%'
  },
  voteTrackerContainer: {
    width: '100%',
    height: '40%',
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.down('xs')]: {
      height: '30%'
    }
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
    },
    [theme.breakpoints.down('xs')]: {
      height: '40px',
      width: '40px',
      fontSize: '16px'
    }
  },
  selectedCircle: {
    border: 'solid 4px black',
    [theme.breakpoints.down('xs')]: {
      border: 'solid 2px black',
    }
  },
  voteContainer: {
    width: '100%',
    height: '60%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    [theme.breakpoints.up('md')]: {
      height: '50%',
      width: '80%',
      margin: 'auto'
    }
  },
  voteConfirmation: {
    width: '100%',
    height: '60%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  voteHeader: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    fontWeight: 'bold',
    fontSize: '20px'
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
    flexDirection: 'column',
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row'
    }
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
    [theme.breakpoints.up('md')]: {
      //left
      height: '100%',
      width: '66%',
    }
  },
  voteButtonContainerBottom: {
    width: '100%',
    height: '30%',
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      height: '100%',
      width: '34%',
    }
  },
  voteButtonSuccess: {
    width: '50%',
    height: '100%',
    backgroundColor: '#006FC2',
    color: 'white',
    fontSize: '30px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    [theme.breakpoints.down('xs')]: {
      fontSize: '20px'
    }
  },
  voteButtonFail: {
    width: '50%',
    height: '100%',
    backgroundColor: '#FF4949',
    color: 'white',
    fontSize: '30px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    [theme.breakpoints.down('xs')]: {
      fontSize: '20px'
    }
  },
  voteButtonReverse: {
    width: '100%',
    height: '100%',
    fontSize: '30px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    [theme.breakpoints.down('xs')]: {
      fontSize: '20px'
    }
    //todo make vertical on wide screens
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
        "alexandraaaaaaaa",
        // "david",
        // "harry",
        // "bob",
        // "fred",
        // "john"
    ],
    "doubleFail": true,
    "reversalsAllowed": true,
    "voteTrack": 1,
    "voteStatus": "VOTING", //BLANK, VOTING_READY, VOTING, VOTE_REGISTERED, DISPLAY_RESULT
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
      submittedVote: 'NONE',
    };

     this.updateBoardData = this.updateBoardData.bind(this);
     this.updateVoteStatus = this.updateVoteStatus.bind(this);
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

  updateVoteStatus(voteStatus) {
    //BLANK, VOTING_READY, VOTING, VOTE_REGISTERED, DISPLAY_RESULT
    let data = this.state.boardData;
    data.voteStatus = voteStatus;
    this.updateBoardData(data);
  }

  submitMissionVote(vote) {
    // vote needs to be either 'SUCCESS' or 'FAIL'
    axios.post('/submitMissionVote', {vote});
    this.updateVoteStatus('VOTE_REGISTERED');
    this.setState({submittedVote: vote});
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
            submittedVote={this.state.submittedVote}
            updateVoteStatus={this.updateVoteStatus}
            voteStatus={this.state.boardData.voteStatus}
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
  const { returnedState = {}, submitMissionVote, submittedVote, updateVoteStatus, voteStatus = 'BLANK' } = props;
  const { missionVoteCount = {}, playersList = [], doubleFail = false, reversalsAllowed = false, voteTrack = 1, missions = [] } = returnedState;

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
            submittedVote={submittedVote}
            updateVoteStatus={updateVoteStatus}
            voteStatus={voteStatus}
            reversalsAllowed={reversalsAllowed}
            missionVotes={missionVoteCount}
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
  const theme = useTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.down('xs'));

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
        className={classes.questInfoItemCircle}
        style={{ backgroundColor, color: fontColor }}
      >
        { misSize }
      </div>
      {(doubleFail && misNum === 3) &&
        <div className={classes.doubleFail}>
          {smallScreen ? 'x2' : 'TWO FAILS REQUIRED'}
        </div>}
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
  const { submitMissionVote, submittedVote, updateVoteStatus, voteStatus, reversalsAllowed, missionVotes } = props;

  switch(voteStatus) {
    case 'VOTING_READY':
      return(
        <VoteNow
          updateVoteStatus={updateVoteStatus}
        />
      );
    case 'VOTING':
      return (
        <MissionVote
          submitMissionVote={submitMissionVote}
          updateVoteStatus={updateVoteStatus}
          reversalsAllowed={reversalsAllowed}
        />
      );
    case 'VOTE_REGISTERED':
      return(
        <VoteConfirmation
          submittedVote={submittedVote}
        />
      );
    case 'DISPLAY_RESULT':
      return(
        <ResultDisplay
          missionVotes={missionVotes}
        />
      );
    case 'BLANK':
    default:
      return(<div></div>);
  }
}

function VoteNow (props) {
  const classes = useStyles();
  return (
    <div className={classes.voteToggleContainer}>
      <button className={classes.voteToggle} onClick={() => props.updateVoteStatus('VOTING')}>
        Vote Now
      </button>
    </div>
  );
}

function MissionVote (props) {
  const classes = useStyles();
  return (
    <div className={classes.voteContainer}>
      <div className={classes.voteHeader}>
        Mission Result Vote:
        <div className={classes.voteCancelContainer}>
          <button className={classes.voteCancelButton} onClick={() => props.updateVoteStatus('VOTING_READY')}>Cancel</button>
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
        { props.reversalsAllowed &&
          <div className={classes.voteButtonContainerBottom}>
            <button className={classes.voteButtonReverse} onClick={() => props.submitMissionVote('REVERSE')}>
              Reverse
            </button>
          </div>
        }
      </div>
    </div>
  )
}

function VoteConfirmation (props) {
  const classes = useStyles();
  return (
    <div className={classes.voteConfirmation}>
      {`You voted ${props.submittedVote}`}
    </div>
  );
}

function ResultDisplay (props) {
  const classes = useStyles();
  const {missionVotes} = props;
  return (
    <div className={classes.questResultDisplay}>
      <div>{ missionVotes.SUCCESS > 0 && `Success Votes: ${missionVotes.SUCCESS}` }</div>
      <div>{ missionVotes.FAIL > 0 && `Fail Votes: ${missionVotes.FAIL}` }</div>
      <div>{ missionVotes.REVERSE > 0 && `Reversals: ${missionVotes.REVERSE}` }</div>
    </div>
  );
}
