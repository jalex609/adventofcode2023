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
        finalRaces.push({ raceLength, record, winningNums });
    }

    const finalAmt = finalRaces.reduce((accAmt, { winningNums }) => {
        return accAmt * winningNums.length;
    }, 1);

    const winningNumsPartII = findWinningNums(partIIRaceLength, partIIRecord);

    console.log('Total for part I is: '  + finalAmt);
    console.log('Total for part II is: ' + winningNumsPartII.length);
}

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

parseInput();