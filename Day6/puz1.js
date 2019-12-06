const { input } = require("./shared");

const splittedInput = input.map(orbit => orbit.split(")"));
let total = -1;

const route = startPoint => {
  let nextPoint = splittedInput.filter(single => single[1] === startPoint)[0];
  while (nextPoint) {
    nextPoint = splittedInput.filter(single => single[1] === nextPoint[0])[0];
    total++;
  }
};

splittedInput.forEach(orbits => {
  const [_, rightOrbit] = orbits;
  route(rightOrbit);
});

console.log(`What is the total number of direct and indirect orbits in your map data?
=> Answer: ${total}`);
