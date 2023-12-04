const fs = require('fs');
const inputFile = fs.readFileSync(__dirname + '/input').toString('utf8');
const inputs = inputFile.split('\n');

function parseInput(line) {
  const [ , gameInfo] = line.split(':');
  const [winningNums, matchNums ] = gameInfo.trim().split('|');
  const winningNumSet = new Set(winningNums.trim().split(' ').map((i) => parseInt(i)).filter((i) => !isNaN(i)));
  const matchNumSet = new Set(matchNums.trim().split(' ').map((i) => parseInt(i)).filter((i) => !isNaN(i)));

  return { winningNumSet, matchNumSet };
}

function calculateSumOfGames() {
  const parsedGames = inputs.map((i) => parseInput(i));
  const totalSum = parsedGames.reduce((totalSum, { winningNumSet, matchNumSet }) => {
    const winningNumIntersection = new Set([...winningNumSet].filter(x => matchNumSet.has(x)));
    if (winningNumIntersection.size > 0) {
      return totalSum + Math.pow(2, winningNumIntersection.size - 1);
    } else {
      return totalSum;
    }
  }, 0);
  console.log('Total sum for part 1 is: ' + totalSum);
}

function calculateNumOfScratchWithCopies() {
  const parsedGames = inputs.map((i) => parseInput(i));
  const totalCounts = parsedGames.reduce((cardsOfEach, { winningNumSet, matchNumSet }, index) => {
    if (!cardsOfEach[index]) {
      cardsOfEach[index] = 0;
    }
    cardsOfEach[index] += 1; // add original
    const winningNumIntersection = new Set([...winningNumSet].filter(x => matchNumSet.has(x)));
    for (let copyIndex = index + 1; copyIndex < index + 1 + winningNumIntersection.size; copyIndex++) {
      if (copyIndex >= parsedGames.length) { // don't go out of bounds
        break;
      }
      if (!cardsOfEach[copyIndex]) {
        cardsOfEach[copyIndex] = 0;
      }
      cardsOfEach[copyIndex] += cardsOfEach[index]; // add a copy for all the copies at the current index

    }
    return cardsOfEach;
  }, {});


  const totalSum = Object.values(totalCounts).reduce((a, b) => a + b, 0);
  console.log('Total cards for part 2: ' + totalSum);
}


calculateSumOfGames();
calculateNumOfScratchWithCopies();