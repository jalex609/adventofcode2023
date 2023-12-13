const fs = require('fs');
const inputFile = fs.readFileSync(__dirname + '/inputSqueeze').toString('utf8');
const inputs = inputFile.split((/\r\n|\r|\n/));

function parseInputs(inputArr=null) {
  inputArr = inputArr ?? inputs;
  const pipeMap =  inputArr.reduce((finalMap, input, rowIdx) => {
    input.split('').forEach((char, colIdx) => {
      parsePipeChar(char, rowIdx, colIdx, input.length - 1, inputArr.length - 1, finalMap);
    });
    return finalMap;
  }, {});

  return { pipeMap, rows: inputArr.length, columns: inputArr[0].length };

}

function findCycleDistanceAndEnclosed() {
  const { pipeMap, rows, columns } = parseInputs();
  console.log('Answer for part I is: ' + findCycles(pipeMap));
  console.log('Answer for part II is: ' + doubleGraph(rows, columns, pipeMap));
}

function doubleGraph(rows, columns, pipeMap) {
  const expandedTiles = new Set();
  const nonCycleTiles = Object.keys(pipeMap).filter((pos) => {
    return pipeMap[pos]?.visited === undefined;
  });
  const strMap = inputs.map((i) => i.split(''));
  for (let i = 0; i < nonCycleTiles.length; i++) {
    const [row, col] = nonCycleTiles[i].split(',');
    strMap[parseInt(row)][parseInt(col)] = '.';
  }
  const newArray = [];
  for(let i = 0; i < rows * 2; i++) {
    newArray.push(new Array(columns * 2));
  }

  // create 2x2 version of original grid to fix "squeezing"
  for (let rowIdx = 0; rowIdx < rows; rowIdx++) {
    newArray.forEach((line) => {
      console.log(line.join(''));
    });
    for (let colIdx = 0; colIdx < columns; colIdx++) {
      const currOriginal = strMap[rowIdx][colIdx];
      const expandPipeResult = expandPipe(currOriginal);

      for (let expRowIdx = 0; expRowIdx < expandPipeResult.length; expRowIdx++) {
        const colLength = expandPipeResult[expRowIdx].length;
        for (let expColIdx = 0; expColIdx < colLength; expColIdx++) {
          const expandedMapRow = rowIdx * 2 + expRowIdx; // double the row + wherever we are in the 2x2 returned
          const expandedMapCol = colIdx * 2 + expColIdx;
          newArray[expandedMapRow][expandedMapCol] = expandPipeResult[expRowIdx][expColIdx];
          // only the 0,0 tile is original, otherwise it is an "expanded" tile and shouldn't be counted in final count
          if (expRowIdx !== 0 || expColIdx !== 0) {
            expandedTiles.add(expandedMapRow + ',' + expandedMapCol);
          }
        }
      }
    }
  }

  // parseIntoMap
  const { pipeMap: pipeMapDoubled } = parseInputs(newArray.map((row) => row.join('')));
  findCycles(pipeMapDoubled); // find the doubled cycle
  return findEnclosedTiles(pipeMapDoubled, expandedTiles); // find the enclosed tiles, ignoring the expanded
}

function expandPipe(org) {
  if (org === '.') {
    return [
      ['.', '.'],
      ['.', '.']
    ];
  } else if (org === '|') {
    return [
      ['|', '.'],
      ['|', '.']
    ]
  } else if (org === '-') {
    return [
      ['-', '-'],
      ['.', '.']
    ]
  } else if (org === 'L') {
    return [
      ['L', '-'],
      ['.', '.']
    ]
  } else if (org === 'J') {
    return [
      ['J', '.'],
      ['.', '.']
    ]
  } else if (org === '7') {
    return [
      ['7', '.'],
      ['|', '.']
    ]
  } else if (org === 'F') {
    return [
      ['F', '-'],
      ['|', '.']
    ]
  }
  // bit of a cheat by knowing what "S" looks like, but could find it dynamically if needed
  else if (org === 'S') {
    return [
      ['S', '-'],
      ['|', '.']
    ];
  }

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

function findEnclosedTiles(pipeMap, expandedTiles) {
  const nonCycleTiles = Object.keys(pipeMap).filter((pos) => {
    return pipeMap[pos]?.visited === undefined;
  });

  let isEnclosedSum = 0;
  for (const nonCyclePos of nonCycleTiles) {
    if (!expandedTiles.has(nonCyclePos.toString())) {
      const isEnclosed = checkEnclosed(nonCyclePos, pipeMap);
      if (isEnclosed) {
        isEnclosedSum += 1;
      }
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
    const finalCandidates = posnsToCheckCandidates.filter((pos) => {
      let notPartOfCycle = pipeMap?.[pos.toString()]?.visited === undefined;
      const alreadyTried = alreadyTraversed.has(pos.toString());
      return notPartOfCycle && !alreadyTried;
    })
    candidatesToEscape.unshift(...finalCandidates);
    alreadyTraversed.add(rowCurr + ',' + colCurr);
  }
  return true;
}


findCycleDistanceAndEnclosed();