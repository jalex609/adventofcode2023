const fs = require('fs');
const inputFile = fs.readFileSync(__dirname + '/input').toString('utf8');
const inputs = inputFile.split('\n');

const resourceList = [ 'seed', 'soil', 'fertilizer', 'water', 'light', 'temperature', 'humidity', 'location' ];

function parseInputs() {
  let seeds;
  const map = {
    'seed': {},
    'soil': {},
    'fertilizer': {},
    'water': {},
    'light': {},
    'temperature': {},
    'humidity': {},
    'location': {}
  };
  let currentToResource = '', currentFromResource = '';
  const cleanedInputs = inputs.filter((str) => str !== '');
  for (let i=0; i < cleanedInputs.length; i += 1) {
    const currentLine = cleanedInputs[i];
    const newFromTo = isStartOfMap(currentLine);
    if (currentLine.startsWith('seeds:')) {
      const [, seedStrings] = currentLine.split(':');
      seeds = seedStrings.trim().split(/\s+/).map((i) => parseInt(i));
    } else if (newFromTo) {
      currentFromResource = newFromTo.from;
      currentToResource = newFromTo.to;
      map[currentFromResource] = [];
    } else {
      //564780290
      const [toStart, fromStart, rangeLength] = currentLine.split(/\s+/);
      const toStartInt = parseInt(toStart);
      const fromStartInt = parseInt(fromStart);
      const rangeInt = parseInt(rangeLength);
      map[currentFromResource].push({
        fromRange: [fromStartInt, fromStartInt + rangeInt],
        toRange: [toStartInt, toStartInt + rangeInt],
        difference: toStartInt - fromStartInt,
        to: currentToResource
      })
    }
  }
  return { map, seeds };
}

function findFinalLocation() {
  const { map, seeds } = parseInputs();
  const seedMap = seeds.map((seed) => goThroughMappings(seed, map));
  const min = Math.min(...seedMap.map((path) => path.location));
  console.log('Closest location for Part I is: ' + min);
}

function goThroughMappings(seed, map) {
  let currentFromResource = 'seed';
  let currentFromValue = seed;
  const finalMapping = {
    'seed': seed
  };
  while (currentFromResource !== 'location') {
    const newPosition = findPosition(currentFromValue, currentFromResource, map);
    const newResource = resourceList[resourceList.findIndex((val) => val === currentFromResource) + 1];
    finalMapping[newResource] = newPosition;

    // Update to go to the next link in resource
    currentFromResource = newResource;
    currentFromValue = newPosition;
  }
  return finalMapping;
}
function findPosition(resourceValue, resourceName, map) {
  const resourceMap = map[resourceName];
  const inRangeEntries = resourceMap.filter(({ fromRange }) => withinRange(fromRange, resourceValue));
  if (inRangeEntries.length > 0) {
    // add difference between 2
    // works in both direction if from = 98 and to = 50 and range = 2, then 50 - 98 = -48 so 99 + -48 = 51
    // if from = 50 and to = 52, then 52 - 50 = 2, so 53 + 2 = 55 which is the same thing
    return resourceValue + inRangeEntries[0]['difference'];
  } else {
    return resourceValue; // unmapped so return same value
  }
}

function withinRange(range, value) {
  return value >= range[0] && value <= range[1];
}

function isStartOfMap(currentLine) {
  const matchMapRegex = currentLine.match(/([a-z]+)-to-([a-z]+)/);
  if (matchMapRegex) {
    const [ , from, to ] = matchMapRegex;
    return { from, to };
  }
}

findFinalLocation();