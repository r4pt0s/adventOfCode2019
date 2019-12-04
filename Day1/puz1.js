const { calculateFuel, input } = require("./shared");

answer1 = input.reduce((acc, curMass) => acc + calculateFuel(curMass), 0);

console.log(`What is the sum of the fuel requirements for all of the modules on your spacecraft?
=> Answer: ${answer1}`);
