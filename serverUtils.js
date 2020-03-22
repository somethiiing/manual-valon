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

var shuffle = function (array) {

	var currentIndex = array.length;
	var temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;

};

module.exports = {
  setMissionSizes,
  shuffle
}
