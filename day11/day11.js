const fs = require('fs');
const inputFile = fs.readFileSync(__dirname + '/input').toString('utf8');
const inputs = inputFile.split((/\r\n|\r|\n/));

function parseInputs() {
  // get parsed arr with marked rows and columns
  const { markedRows, markedColumns, arr } = markExpansion(inputs);
  const partISum = findGalaxies(arr, 2, markedRows, markedColumns); // find part I sum, only 2 wide
  const partIISum = findGalaxies(arr, 1000000, markedRows, markedColumns); // find part II sum, 1,000,000 wide
  console.log('Part I sum is: ' + partISum);
  console.log('Part II sum is: ' + partIISum);

}

// mark which rows are expanded while maintaining original 2d array
function markExpansion(inputs) {
  const newArray = [];
  const markedRows = new Set();
  const markedColumns = new Set();
  inputs.forEach((row, i) => {
    const rowArr = row.split('');
    newArray.push(rowArr);
    if (rowArr.every((s) => s === '.')) {
      markedRows.add(i);
    }
  });

  for (let colIdx = 0; colIdx < newArray[0].length; colIdx++) {
    let column = [];
    for (let rowIdx = 0; rowIdx < newArray.length; rowIdx++) {
      column.push(newArray[rowIdx][colIdx]);
    }
    if (column.every((s) => s === '.')) {
      markedColumns.add(colIdx);
    }
  }

  return { arr: newArray, markedRows, markedColumns }
}

// part i solution, infeasible for part ii so not used
function expandRowsAndColumns(inputs) {
  const newArray = [];
  for (const row of inputs) {
    const rowArr = row.split('');
    newArray.push(rowArr);
    if (rowArr.every((s) => s === '.')) {
      newArray.push(new Array(rowArr.length).fill('.')); // push row again
    }
  }

  for (let colIdx = 0; colIdx < newArray[0].length; colIdx++) {
    let column = [];
    for (let rowIdx = 0; rowIdx < newArray.length; rowIdx++) {
      column.push(newArray[rowIdx][colIdx]);
    }
    if (column.every((s) => s === '.')) {
      for (let k = 0; k < newArray.length; k++) {
        newArray[k].splice(colIdx, 0, '.');
      }
      colIdx += 1;
    }
  }

  return newArray;
}

function findGalaxies(newArr, expansionFactor=2, markedRows, markedColumns) {
  const galaxyList = [];
  let pairSum = 0;
  let rowsMarked = new Set();
  for (let rowIdx = 0; rowIdx < newArr.length; rowIdx++) {
    let columnsMarked = new Set(); // checking columns out, new set every time.
    for (let colIdx = 0; colIdx < newArr[0].length; colIdx++) {
      if (newArr[rowIdx][colIdx] === '#') {
        const newXY = [
          colIdx + (columnsMarked.size * expansionFactor - columnsMarked.size), // column + number of expanded galaxies passed over - its size to keep index correct
          rowIdx + (rowsMarked.size * expansionFactor - rowsMarked.size) // rows + number of expanded galaxies passed over - its size to keep index correct
        ];
        for (const galaxy of galaxyList) {
          pairSum += manhattanDistance(galaxy, newXY);
        }
        galaxyList.push(newXY); // x, y coordinate, column is x
      }
      if (markedRows.has(rowIdx)) {
        rowsMarked.add(rowIdx);
      }
      if (markedColumns.has(colIdx)) {
        columnsMarked.add(colIdx);
      }
    }
  }

  return pairSum;
}

function manhattanDistance(pair1, pair2) {
  const [a1, a2] = pair1;
  const [b1, b2] = pair2;
  return Math.abs(a1 - b1) + Math.abs(a2 - b2);
}

parseInputs()