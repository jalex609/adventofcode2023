const fs = require('fs');
const inputFile = fs.readFileSync(__dirname + '/input').toString('utf8');
const inputs = inputFile.split('\n')

const ans = inputs.reduce((totalSum, inputString) => {
  const digits = [];
  for (let i = 0; i < inputString.length; i++) {
    if (parseInt(inputString[i])) {
      digits.push(parseInt(inputString[i]));
    } else {
      digits.push(inputString[i]);
    }
  }
  const finalDigits = parseOutNumbers(digits);
  // Use weird properties of .toString to turn digits into two digit number
  const lastAndFirst = parseInt(finalDigits[0].toString() + finalDigits[finalDigits.length - 1].toString());
  return totalSum + lastAndFirst;
}, 0);
console.log(ans);

function parseOutNumbers(digits) {
  const finalDigits = [];
  for (let i=0; i < digits.length; i++) {
    if (Number.isInteger(digits[i])) {
      finalDigits.push(digits[i]);
    } else {
      let startIndex = i;
      let numSubstring = digits[i];
      while (!Number.isInteger(digits[startIndex]) && !isNumSubstring(numSubstring) && digits[startIndex]) {
        startIndex += 1;
        numSubstring += digits[startIndex];
      }
      if (isNumSubstring(numSubstring)) {
        finalDigits.push(parseNumSubstring(numSubstring));
      }
    }
  }
  return finalDigits;
}

function isNumSubstring(str) {
  return str === 'one' || str === 'two' || str === 'three' || str === 'four' || str === 'five' || str === 'six' || str === 'seven' || str === 'eight' || str === 'nine';
}

function parseNumSubstring(str) {
  switch (str) {
    case 'one':
      return 1;
    case 'two':
      return 2;
    case 'three':
      return 3;
    case 'four':
      return 4;
    case 'five':
      return 5;
    case 'six':
      return 6;
    case 'seven':
      return 7;
    case 'eight':
      return 8;
    case 'nine':
      return 9;
  }
}