const fs = require('fs');
const inputFile = fs.readFileSync(__dirname + '/input').toString('utf8');
const inputs = inputFile.split('\n');
function sumParts() {
  const full2DArray = inputs.map((input) => input.split(''));

  const totalSum = full2DArray.reduce((totalSum , line, i) => {
    return totalSum + sumLine(line, full2DArray, i);
  }, 0);

  console.log('Sum of parts for part I is: ' + totalSum);
}

function sumOfGearRatios() {
  const full2DArray = inputs.map((input) => input.split(''));

  const allGearTouches = full2DArray.reduce((gearObj , line, i) => {
    findBorderedGears(line, full2DArray, i, gearObj);
    return gearObj;
  }, {});

  const finalSum = Object.values(allGearTouches).reduce((totalSum, gearTouch) => {
    if (gearTouch.touches === 2) {
      return totalSum + gearTouch.allBordering.reduce((a, b) => a * b, 1);
    } else {
      return totalSum;
    }
  }, 0);

  console.log('Final gear ratio sum for part II is: ' + finalSum);
}

function sumLine(line, full2DArray, rowIndex) {
  let totalSum = 0;
  let currNum = '';
  let currNumIsBordering = false;
  for (let columnIndex =0; columnIndex < line.length; columnIndex++) {
    if (Number.isInteger(parseInt(line[columnIndex]))) {
      currNum += line[columnIndex]; // add to number string
      if (!currNumIsBordering) {
        currNumIsBordering = anyBordering(columnIndex, rowIndex, full2DArray);
      }
      // edge case for parsing the last number since it will not hit another symbol
      if (columnIndex === line.length - 1) {
        if (currNumIsBordering) {
          totalSum += parseInt(currNum);
        }
      }
    } else {
      if (currNumIsBordering) {
        totalSum += parseInt(currNum);
      }
      currNum = '';
      currNumIsBordering = false;
    }
  }

  return totalSum;
}

function findBorderedGears(line, full2DArray, rowIndex, allGearsObj) {
  let currNum = '';
  let currBorderingPosns = new Set();
  for (let columnIndex =0; columnIndex < line.length; columnIndex++) {
    if (Number.isInteger(parseInt(line[columnIndex]))) {
      currNum += line[columnIndex]; // add to number string
      const currBorderingGears = getBorderingGears(rowIndex, columnIndex, full2DArray);
      for (const gearPosn of currBorderingGears) {
        currBorderingPosns.add(gearPosn.toString());
      }
      // edge case for parsing the last number since it will not hit another symbol
      if (columnIndex === line.length - 1) {
        for (const symbolPosn of currBorderingPosns) {
          if (!allGearsObj[symbolPosn]) {
            allGearsObj[symbolPosn] = {
              touches: 0,
              allBordering: []
            }
          }
          allGearsObj[symbolPosn].touches += 1;
          allGearsObj[symbolPosn].allBordering.push(parseInt(currNum));
        }
      }
    } else {
      for (const symbolPosn of currBorderingPosns) {
        if (!allGearsObj[symbolPosn]) {
          allGearsObj[symbolPosn] = {
            touches: 0,
            allBordering: []
          }
        }
        allGearsObj[symbolPosn].touches += 1;
        allGearsObj[symbolPosn].allBordering.push(parseInt(currNum));
      }
      currNum = '';
      currBorderingPosns = new Set();
    }
  }

  return allGearsObj;
}

function isSymbol (row, column, full2DArray) {
  const entry = full2DArray?.[row]?.[column];
  // entry exists and is not a period and not a number (thus is symbol)
  return entry && entry !== '.' && isNaN(parseInt(entry));
}

function getBorderingGears(row, column, full2DArray) {
  return getBorderPosns(column, row).filter((pos) => isSymbol(...pos, full2DArray));
}

function anyBordering(columnIndex, rowIndex, full2DArray) {
  return getBorderPosns(columnIndex, rowIndex).some((pos) => isSymbol(...pos, full2DArray));
}

function getBorderPosns(columnIndex, rowIndex) {
  const abovePos = [rowIndex - 1, columnIndex];
  const belowPos = [rowIndex + 1, columnIndex];
  const leftPos = [rowIndex, columnIndex - 1];
  const rightPos = [rowIndex, columnIndex + 1];
  const diagonalUpLeftPos = [rowIndex - 1, columnIndex - 1];
  const diagonalUpRightPos = [rowIndex - 1 , columnIndex + 1];
  const diagonalDownLeftPos = [rowIndex + 1, columnIndex - 1];
  const diagonalDownRightPos = [rowIndex + 1, columnIndex + 1];
  return [
    abovePos, belowPos, leftPos, rightPos,
    diagonalDownRightPos, diagonalDownLeftPos, diagonalUpLeftPos, diagonalUpRightPos
  ];
}

sumParts();
sumOfGearRatios();