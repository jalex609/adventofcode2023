const fs = require('fs');
const inputFile = fs.readFileSync(__dirname + '/input').toString('utf8');
const inputs = inputFile.split((/\r\n|\r|\n/));


function parseInputs() {
  return inputs.map((currLine) => {
    return currLine.split(/\s+/).map((currNum) => parseInt(currNum));
  });
}

function predictionSums() {
  const lines = parseInputs();
  const finalSum = lines.reduce((totalSum, line) => {
    return totalSum + predictNum(line);
  }, 0);
  // go back in history, i.e. reverse the array for part II
  const finalSumBackwards = lines.reduce((totalSum, line) => {
    return totalSum + predictNum(line.reverse());
  }, 0);
  console.log('Part I final sum is: ' + finalSum);
  console.log('Part II final sum is: ' + finalSumBackwards);
}


// yay recursion
function predictNum(sequence) {
  const differenceArr = differenceBetween(sequence);
  if (differenceArr.every((num) => num === 0)) {
    return sequence[sequence.length - 1];
  } else {
    return sequence[sequence.length - 1] + predictNum(differenceBetween(sequence));
  }
}

function differenceBetween(seq) {
  const differences = [];
  for (let i = 0; i < seq.length - 1; i++) {
    differences.push(seq[i + 1] - seq[i]);
  }
  return differences;
}

predictionSums();