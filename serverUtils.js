class Mission {
  constructor(size) {
    this.missionSize = size;
    this.missionResult = 'NOT_WENT';
  }

  setMissionResult (result) {
    this.missionResult = result;
  }
}

let setMissionSizes = (sizes) => {
  return sizes.map( size => new Mission(size));
};

let setMissionResult = (missionNum, result) => {

}

module.exports = {
  setMissionSizes
}
