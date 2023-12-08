const fs = require('fs');
const inputFile = fs.readFileSync(__dirname + '/input').toString('utf8');
const inputs = inputFile.split((/\r\n|\r|\n/));

function parseInput () {
  const directionArray = inputs[0];

  const graphObject = inputs.reduce((accObj, currLine) => {
    const result = parseInputLine(currLine);
    if (result) {
      const { edgeName, leftNeighbor, rightNeighbor } = result;
      accObj[edgeName] = { leftNeighbor, rightNeighbor };
    }
    return accObj
  }, {});
  return { graphObject, directionArray };
}

function parseInputLine(currentLine) {
  // LXH = (AAA, AAA) for example
  const matchResult = currentLine.match(/([A-Z0-9]{3}) = \(([A-Z0-9]{3}), ([A-Z0-9]{3})\)/);
  if (matchResult) {
    const [ , edgeName, leftNeighbor, rightNeighbor ] = matchResult;
    return { edgeName, leftNeighbor, rightNeighbor }
  } else {
    return false;
  }
}

function calcPartI() {
  const { graphObject, directionArray } = parseInput();

  let currEdge = 'AAA';
  let numOfSteps = 0;
  let instructionPlace = 0;
  // go till ZZZ
  while (currEdge !== 'ZZZ') {
    const edgeObject = graphObject[currEdge];
    const currInstruction = directionArray[instructionPlace];
    numOfSteps += 1;
    currEdge = edgeObject[(currInstruction === 'L' ? 'left' : 'right') + 'Neighbor'];
    instructionPlace += 1;
    if (instructionPlace >= directionArray.length) {
      instructionPlace = 0;
    }
  }
  return numOfSteps;
}

function calcPartII() {
  const { graphObject, directionArray } = parseInput();

  let endsWithANodes = Object.keys(graphObject).filter((edgeName) => edgeName.endsWith('A'));
  const endsInZSteps = {};
  let numOfSteps = 0;
  let instructionPlace = 0;
  // go till we have gotten to Z once for each ending with A node
  while (Object.keys(endsInZSteps).length < endsWithANodes.length) {
    const currInstruction = directionArray[instructionPlace];
    for (let i = 0; i < endsWithANodes.length; i++) {
      const currEdge = endsWithANodes[i];
      const edgeObject = graphObject[currEdge];
      endsWithANodes[i] = edgeObject[(currInstruction === 'L' ? 'left' : 'right') + 'Neighbor'];
      if (endsWithANodes[i].endsWith('Z')) {
        endsInZSteps[endsWithANodes[i]] = numOfSteps + 1; // add current num of steps for getting to z once
      }
    }
    numOfSteps += 1;
    instructionPlace += 1;
    if (instructionPlace >= directionArray.length) {
      instructionPlace = 0;
    }
  }

  // find LCM of all numbers of steps to get to Z to find minimum number to get to.
  return Object.values(endsInZSteps).reduce((multiple, currLCM) => {
    return lcm(currLCM, multiple);
  }, 1);

}

// euclidean algorithm for finding gcd
function gcd(a, b) {
  return !b ? a : gcd(b, a % b);
}

// lcm formula using gcd
function lcm(a, b) {
  return (a * b) / gcd (a, b);
}

console.log('Num of steps for part I is: ' + calcPartI());
console.log('Num of steps for partII is: ' + calcPartII());