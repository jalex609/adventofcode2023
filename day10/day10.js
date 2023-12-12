const fs = require('fs');
const inputFile = fs.readFileSync(__dirname + '/inputSqueeze').toString('utf8');
const inputs = inputFile.split((/\r\n|\r|\n/));

function parseInputs() {
  return inputs.reduce((finalMap, input, rowIdx) => {
    input.split('').forEach((char, colIdx) => {
      parsePipeChar(char, rowIdx, colIdx, input.length - 1, inputs.length - 1, finalMap);
    });
    return finalMap;
  }, {});
}

function findCycleDistanceAndEnclosed() {
  const pipeMap = parseInputs();
  console.log('Answer for part I is: ' + findCycles(pipeMap));
  console.log('Answer for part II is: ' + findEnclosedTiles(pipeMap));
}

function findCycles(pipeMap) {
  const startingPos = Object.entries(pipeMap).find(([, { isStart }]) => isStart === true)[0];
  // Find 2 neighbors that have the start as their neighbor to find S shape and true neighbors.
  pipeMap[startingPos].neighbors = Object.entries(pipeMap).filter(([, {neighbors}]) => {
    return neighbors.includes(startingPos)
  }).map(([pos]) => pos);

  let currentPos = startingPos;
  let toVisit = pipeMap[startingPos].neighbors;
  let visitingPos;
  // Do a DFS-like thing to find the cycle back to start
  while (visitingPos !== startingPos) {
    visitingPos = toVisit.shift();
    if (!pipeMap[visitingPos].visited) {
      pipeMap[visitingPos].distanceFromStart = pipeMap[currentPos].distanceFromStart + 1;
      pipeMap[visitingPos].visited = true;
    }
    toVisit.unshift(...pipeMap[visitingPos].neighbors.filter((pos) => pos !== currentPos));
    currentPos = visitingPos;
  }
  // This will calculate the number of tiles in the full cycle back. Halfway through that is the farthest distance
  const numOfTilesInCycle = Math.max(...Object.values(pipeMap)
    .filter(({ distanceFromStart }) => !!distanceFromStart)
    .map(({ distanceFromStart}) => distanceFromStart));

  // Farthest point is half the cycle
  return numOfTilesInCycle / 2;
}


function parsePipeChar(pipeChar, rowIdx, colIdx, maxColIdx, maxRowIdx, pipeMap) {
  const neighbors = [];
  let isStart = false;
  if (pipeChar === '|') {
    // goes up and down
    neighbors.push(...findValidNeighbors([[rowIdx + 1, colIdx], [rowIdx - 1, colIdx]], maxColIdx, maxRowIdx));
  } else if (pipeChar === '-') {
    // goes left and right
    neighbors.push(...findValidNeighbors([[rowIdx, colIdx + 1], [rowIdx, colIdx - 1]], maxColIdx, maxRowIdx));
  } else if (pipeChar === 'L') {
    // goes up and right
    neighbors.push(...findValidNeighbors([[rowIdx - 1, colIdx], [rowIdx, colIdx + 1]], maxColIdx, maxRowIdx));
  } else if (pipeChar === 'J') {
    // goes up and left
    neighbors.push(...findValidNeighbors([[rowIdx - 1, colIdx], [rowIdx, colIdx - 1]], maxColIdx, maxRowIdx));
  } else if (pipeChar === '7') {
    // goes down and left
    neighbors.push(...findValidNeighbors([[rowIdx + 1, colIdx], [rowIdx, colIdx - 1]], maxColIdx, maxRowIdx));
  } else if (pipeChar === 'F') {
    // goes down and right
    neighbors.push(...findValidNeighbors([[rowIdx + 1, colIdx], [rowIdx, colIdx + 1]], maxColIdx, maxRowIdx));
  } else if (pipeChar === '.') {
    // no neighbors
    neighbors.push(...findValidNeighbors([]));
  } else if (pipeChar === 'S') {
    // dont know what it is so could go up down, left or right, included in that order in array
    neighbors.push(...findValidNeighbors([
      [rowIdx + 1, colIdx],
      [rowIdx - 1, colIdx],
      [rowIdx, colIdx - 1],
      [rowIdx, colIdx + 1]],
      maxColIdx,
      maxRowIdx
    ));
    isStart = true;
  }

  pipeMap[rowIdx + ',' + colIdx] = {
    neighbors: neighbors.map((n) => n[0] + ',' + n[1]),
    character: pipeChar
  }
  if (isStart) {
    pipeMap[rowIdx + ',' + colIdx].isStart = true;
    pipeMap[rowIdx + ',' + colIdx].distanceFromStart = 0;
  }
}

function findValidNeighbors(possibleNeighbors, maxColIdx, maxRowIdx) {
  return possibleNeighbors.filter(([row, col]) => {
    return (row >= 0 && row <= maxRowIdx) && (col >= 0 && col <= maxColIdx);
  });
}

function findEnclosedTiles(pipeMap) {
  const nonCycleTiles = Object.keys(pipeMap).filter((pos) => {
    return pipeMap[pos]?.visited === undefined;
  });

  let isEnclosedSum = 0;
  for (const nonCyclePos of nonCycleTiles) {
    const isEnclosed = checkEnclosed(nonCyclePos, pipeMap);
    if (isEnclosed) {
      isEnclosedSum += 1;
    }
  }

  return isEnclosedSum;
}

function checkEnclosed(pos, pipeMap) {
  const [rowStr, colStr] = pos.split(',');
  const intPos = [parseInt(rowStr), parseInt(colStr)];
  const alreadyTraversed = new Set();
  let candidatesToEscape = [intPos];
  while (candidatesToEscape.length > 0) {
    const [rowCurr, colCurr] = candidatesToEscape.shift();
    if (pipeMap?.[rowCurr + ',' + colCurr] === undefined) {
      return false; // it escaped!
    }
    // up, down, left, right
    const posnsToCheckCandidates = [[rowCurr - 1, colCurr], [rowCurr + 1, colCurr], [rowCurr, colCurr - 1], [rowCurr, colCurr + 1]];
    const finalCandidates = posnsToCheckCandidates.filter((pos, i) => {
      const notPartOfCycle = pipeMap?.[pos.toString()]?.visited === undefined;
      const isPipeSqueezeCheck = isPipeSqueeze(pos, pipeMap, i <= 1);
      const alreadyTried = alreadyTraversed.has(pos.toString());
      return (notPartOfCycle || isPipeSqueezeCheck) && !alreadyTried;
    })
    candidatesToEscape.unshift(...finalCandidates);
    alreadyTraversed.add(rowCurr + ',' + colCurr);
  }
  return true;
}


function isPipeSqueeze(newPosn, pipeMap, isVertical) {
  const [nextRow, nextCol] = newPosn;
  if (pipeMap?.[newPosn.toString()]?.visited) {
    const atPosn = pipeMap[newPosn];
    // up, down, left, right
    const posnsToCheckCandidates = [[nextRow - 1, nextCol], [nextRow + 1, nextCol], [nextRow, nextCol - 1], [nextRow, nextCol + 1]];
    const [up, down, left, right] = posnsToCheckCandidates;
    const [upEntry, downEntry, leftEntry, rightEntry] = posnsToCheckCandidates.map((p) => pipeMap?.[p.toString()]);

    if (isVertical) {
      // if right entry is not neighbors with left and left not with right
      if (rightEntry?.visited && Math.abs(atPosn.distanceFromStart - rightEntry?.distanceFromStart) > 1 ||
        leftEntry?.visited && Math.abs(atPosn.distanceFromStart - leftEntry?.distanceFromStart) > 1) {
        return true;
      }

    } else {
      if (upEntry?.visited && Math.abs(atPosn.distanceFromStart - upEntry?.distanceFromStart) > 1 ||
        downEntry?.visited && Math.abs(atPosn.distanceFromStart - downEntry?.distanceFromStart) > 1) {
        return true;
      }
    }
  }
  return false;
}

function checkSqueezeNeighbors(isVertical, ) {
  right
}

findCycleDistanceAndEnclosed();