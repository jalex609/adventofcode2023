const fs = require('fs');
const inputFile = fs.readFileSync(__dirname + '/input').toString('utf8');
const inputs = inputFile.split('\n')

const NUM_RED_CUBES = 12;
const NUM_GREEN_CUBES = 13;
const NUM_BLUE_CUBES = 14;

function formatGame(gameInput) {
  // Split ID and game content
  const [gameIDString, gameResults] = gameInput.split(':');

  // Get ID of game
  const [ , id] = gameIDString.split(' ');
  const idInt = parseInt(id);

  // Format pulls from bag
  const finalPullList = [];
  const separatePulls = gameResults.split(';')
  for (const game of separatePulls) {
    const colorCubes = game.split(',');
    const colorDict = {};
    for (const color of colorCubes) {
      const [numString, colorVal] = color.trim().split(' ');
      colorDict[colorVal] = parseInt(numString);
    }
    finalPullList.push(colorDict);
  }

  return { idInt, finalPullList };
}

function findPossibleGames() {
  const allGames = inputs.reduce((accObj, inputStr) => {
    const { idInt, finalPullList } = formatGame(inputStr);
    accObj[idInt] = finalPullList;
    return accObj;
  }, {});

  calculateSumOfPossibleGames(allGames); // part I
  calculatePowerOfGames(Object.values(allGames));
}

function calculateSumOfPossibleGames(allGames) {
  const totalSum = Object.entries(allGames).reduce((idSum, [idStr, pullList]) => {
    if (isGamePossible(pullList)) {
      return idSum + parseInt(idStr);
    } else {
      return idSum;
    }
  }, 0);

  console.log('Answer of ID sum for part I is: ' + totalSum);
}

function calculatePowerOfGames(allGamePullList) {
  const powerSum = allGamePullList.reduce((totalSum, pullList) => {
    const powerOfGame = findPowerOfGame(pullList);
    return totalSum + powerOfGame;
  }, 0);

  console.log('Answer of power sum for part II is: ' + powerSum);
}

function findPowerOfGame(pullList) {
  const minimumCubesNeeded = pullList.reduce((accObj, singlePull) => {
    accObj['green'] = Math.max(singlePull['green'] ?? 0, accObj['green']);
    accObj['red'] = Math.max(singlePull['red'] ?? 0, accObj['red']);
    accObj['blue'] = Math.max(singlePull['blue'] ?? 0, accObj['blue']);
    return accObj;
  }, { green: 0, red: 0, blue: 0 });

  return minimumCubesNeeded['green'] * minimumCubesNeeded['red'] * minimumCubesNeeded['blue'];
}

function isGamePossible(pullList) {
  for (const pull of pullList) {
    if (pull['red'] > NUM_RED_CUBES) {
      return false;
    } else if (pull['green'] > NUM_GREEN_CUBES) {
      return false;
    } else if (pull['blue'] > NUM_BLUE_CUBES) {
      return false;
    }
  }
  return true;
}

findPossibleGames();