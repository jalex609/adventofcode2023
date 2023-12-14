const fs = require('fs');
const inputFile = fs.readFileSync(__dirname + '/input').toString('utf8');
const inputs = inputFile.split((/\r\n|\r|\n/));


function partII() {

}

function parseInputs(inputs) {
  return inputs.map((i) => {
    const [schematic, positions] = i.split(' ');
    const finalSchematic = schematic.split('');
    const finalPositions = positions.split(',').map((p) => parseInt(p));
    return { finalSchematic, finalPositions };
  });
}
let lookup = {};
function partI() {
  const parsedArray = parseInputs(inputs);
  const permArraySum = parsedArray.reduce((totalSum, currLine, i) => {
    console.log(i);
    lookup = {};
    return totalSum + calculatePossiblePermutations(currLine.finalSchematic, currLine.finalPositions);
  }, 0);
  console.log('Total for part I is: ' + permArraySum);
}

function calculatePossiblePermutations(schematic, positions) {
  // if all chosen
  if (!schematic.some((s) => s === '?')) {
    return  calculateContGroups(schematic).toString() === positions.toString() ? 1 : 0;
  } else if (Number.isInteger(lookup[schematic.join('')])) {
    console.log('hit memo');
    return lookup[schematic.join('')];
  } else {
    for (let i = 0; i < schematic.length; i++) {
      if (schematic[i] === '?') {
        const copy1 = JSON.parse(JSON.stringify(schematic));
        const copy2 = JSON.parse(JSON.stringify(schematic));
        copy1[i] = '#';
        copy2[i] = '.';
        lookup[schematic.join('')] = calculatePossiblePermutations(copy1, positions, lookup) + calculatePossiblePermutations(copy2, positions, lookup);
        return lookup[schematic.join('')];
      }
    }
  }
}

function calculateContGroups(schematic) {
  let curSchematic = [];
  let contiguousSectionLen = 0;
  for (let i =0; i < schematic.length; i++) {
    if (schematic[i] === '#') {
      contiguousSectionLen += 1;
    } else {
      if (contiguousSectionLen > 0) {
        curSchematic.push(contiguousSectionLen);
      }
      contiguousSectionLen = 0;
    }
  }
  if (contiguousSectionLen > 0) {
    curSchematic.push(contiguousSectionLen);
  }
  return curSchematic
}


partI();