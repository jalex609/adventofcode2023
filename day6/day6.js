const fs = require('fs');
const inputFile = fs.readFileSync(__dirname + '/input').toString('utf8');
const inputs = inputFile.split((/\r\n|\r|\n/));

function parseInput() {
    const [raceLengthNums, recordNums] = inputs.map((input) => {
        return input.split(':')[1].trim().split(/\s+/).map((numString) => parseInt(numString));
    });

    const partIIRaceLength = parseInt(raceLengthNums.reduce((accStr, currNum) => {
        return accStr + currNum.toString();
    }, ''));
    const partIIRecord = parseInt(recordNums.reduce((accStr, currNum) => {
        return accStr + currNum.toString();
    }, ''));

    const finalRaces = [];
    for (i = 0; i < raceLengthNums.length; i++) {
        const raceLength = raceLengthNums[i];
        const record = recordNums[i];
        const winningNums = findWinningNums(raceLength, record);
        const winningNumsQuad = winningAmountQuadratic(raceLength, record);
        finalRaces.push({ raceLength, record, amountWinning: winningNums.length, amountWinQuad: winningNumsQuad});
    }

    const finalAmt = finalRaces.reduce((accAmt, { amountWinning }) => {
        return accAmt * amountWinning;
    }, 1);

    const finalAmtQuad = finalRaces.reduce((accAmt, { amountWinQuad }) => {
        return accAmt * amountWinQuad;
    }, 1);

    const winningNumsPartII = winningAmountQuadratic(partIIRaceLength, partIIRecord);

    console.log('Total for part I without quadratic is: ' + finalAmt);
    console.log('Total for part I with quadratic is: ' + finalAmtQuad);
    console.log('Total for part II is: ' + winningNumsPartII);
}

// boring brute force way
function findWinningNums(raceLength, record) {
    const winningNums = [];
    for (let i = 1; i < raceLength; i++) {
        const distanceTraveled = i * (raceLength - i);
        if (distanceTraveled > record) {
            winningNums.push({ holdAmount: i, distanceTraveled });
        }
    }
    return winningNums;
}

// fun math way
function winningAmountQuadratic(raceLength, record) {
    // quadratic formula derived from distance = (holdTime)(raceLength - holdtime)
    // this expands to -holdtime^2 - raceLength(holdtime).
    // Solutions that are at least the record are -holdtime^2 + raceLength(holdtime) - record = 0
    // This give us quadratic formula to solve -1x^2 + raceLength(x) - record = 0
    // Solving for the 2 roots and subtracting them gives us the amount of x-axis (i.e holds) that are greater
    // than the range
    const a = -1;
    const b = raceLength;
    const c = -record;

    // quadratic formula roots
    const firstRoot = (-b + Math.sqrt(Math.pow(b, 2) - (4 * a * c))) / (2 * a);
    const secondRoot = (-b - Math.sqrt(Math.pow(b, 2) - (4 * a * c))) / (2 * a);

    return Math.abs(Math.ceil(firstRoot) - Math.ceil(secondRoot));
}

parseInput();