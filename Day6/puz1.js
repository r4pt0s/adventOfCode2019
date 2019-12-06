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

splittedInput.forEach((orbits, i) => {
  const [_, rightOrbit] = orbits;
  process.stdout.write("\033c");
  console.log(
    `calculating direct/indirect orbits `,
    "\x1b[36m",
    `${i + 1}`,
    "\x1b[37m",
    "of",
    "\x1b[31m",
    ` ${splittedInput.length} `
  );
  route(rightOrbit);
});

console.log(
  "\x1b[37m",
  `What is the total number of direct and indirect orbits in your map data?
=> Answer: ${total}`
);
