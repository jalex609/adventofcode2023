const fs = require('fs');
const inputFile = fs.readFileSync(__dirname + '/input').toString('utf8');
const inputs = inputFile.split((/\r\n|\r|\n/));

const valueMap = {
    'A': 14,
    'K': 13,
    'Q': 12,
    'J': 11,
    'T': 10,
    '9': 9,
    '8': 8,
    '7': 7,
    '6': 6,
    '5': 5,
    '4': 4,
    '3': 3,
    '2': 2,
    'Joker': 1
}

const finalCardArray = {
    '5Kind': [],
    '4Kind': [],
    'FullHouse': [],
    '3Kind': [],
    '2Pair': [],
    '1Pair': [],
    'HighCard': [] 
};

const finalCardArrayPartII = {
    '5Kind': [],
    '4Kind': [],
    'FullHouse': [],
    '3Kind': [],
    '2Pair': [],
    '1Pair': [],
    'HighCard': [] 
}

function parseLine(line) {
    const [handStr, bidStr] = line.split(/\s+/);
    const bid = parseInt(bidStr);
    parseHand(handStr, bid);
}

function getHandStats(handStr, isPtII) {
    const handArr = handStr.split('');
    const amountOfEachCard = {};
    let lexString = ''; // put string in lexicographic order to sort later
    for (let i = 0; i < handArr.length; i++) {
        const value = handArr[i];
        lexString += String.fromCharCode(97 + ((value === 'J' && isPtII) ? valueMap['Joker'] : valueMap[value]));
        
        // Totaling hand
        if (!amountOfEachCard[value]) {
            amountOfEachCard[value] = 0;
        }
        amountOfEachCard[value] += 1;
    }
    return { amountOfEachCard, lexString };
}

function parseHand(handStr, bid) {
    const { amountOfEachCard, lexString } = getHandStats(handStr, false);
    const { amountOfEachCard: amtEachCardPtII, lexString: lexStringII } = getHandStats(handStr, true);

    if (amtEachCardPtII['J']) {
        const entryToAdd = Object.entries(amtEachCardPtII).reduce((acc, [key, value]) => {
            if (key === 'J') {
                return acc;
            }
            if (value >= acc.max) {
                return { max: value, letter: key }
            } else {
                return acc;
            }
        }, {max: 0, letter: 'Joker'});
        // if not all jokers, add the jokers amount to highest other amount and delete joker
        if (!(entryToAdd.letter === 'Joker' || entryToAdd.letter === 'J')) {
            amtEachCardPtII[entryToAdd.letter] += amtEachCardPtII['J'];
            delete amtEachCardPtII.J;
        }
    }

    addToCardArray(finalCardArray, amountOfEachCard, lexString, bid);
    addToCardArray(finalCardArrayPartII, amtEachCardPtII, lexStringII, bid);
}

function addToCardArray(arrayToUpdate, amountOfEachCard, lexString, bid) {
    const sortedNumList = Object.values(amountOfEachCard).sort();
    if (sortedNumList.length === 1) {
        arrayToUpdate['5Kind'].push({ lexString, bid })
    } else if (sortedNumList.length === 2 && sortedNumList[0] === 1 && sortedNumList[1] === 4) {
        arrayToUpdate['4Kind'].push({ lexString, bid });
    } else if (sortedNumList.length === 2 && sortedNumList[0] === 2 && sortedNumList[1] === 3) {
        arrayToUpdate['FullHouse'].push({ lexString, bid });
    } else if (sortedNumList.length === 3 && sortedNumList[0] === 1 && sortedNumList[1] === 1 && sortedNumList[2] === 3) {
        arrayToUpdate['3Kind'].push({ lexString, bid });
    } else if (sortedNumList.length === 3 && sortedNumList[0] === 1 && sortedNumList[1] === 2 && sortedNumList[2] === 2) {
        arrayToUpdate['2Pair'].push({ lexString, bid });
    } else if (sortedNumList.length === 4) {
        arrayToUpdate['1Pair'].push({ lexString, bid });
    } else if (sortedNumList.length === 5) {
        arrayToUpdate['HighCard'].push({ lexString, bid });
    }
}

function calculateFinalWinnings(cardArray) {
    let finalSum = 0;
    let currentRank = 0;
    for (const handType of ['HighCard', '1Pair', '2Pair', '3Kind', 'FullHouse', '4Kind', '5Kind']) {
        cardArray[handType].sort((a, b) => {
            if (a.lexString < b.lexString) {
                return -1;
            } else if (a.lexString > b.lexString) {
                return 1;
            } else {
                return 0;
            }
        });
        for (let i = 0; i < cardArray[handType].length; i++) {
            currentRank += 1;
            finalSum += currentRank * cardArray[handType][i].bid;
        }
    }
    return finalSum
}

// part I
function rankOfAllHands() {
    inputs.forEach((input) => {
        parseLine(input);
    });

    console.log('final answer for part I is: ' + calculateFinalWinnings(finalCardArray));
    console.log('final answer for part II is: ' + calculateFinalWinnings(finalCardArrayPartII));
} 
rankOfAllHands();