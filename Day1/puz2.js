const { calculateFuel, input } = require("./shared");

const fuelRequirements = input.reduce((acc, moduleMass) => {
  while ((moduleMass = calculateFuel(moduleMass)) > 0) {
    acc += moduleMass;
  }
  return acc;
}, 0);

console.log(`What is the sum of the fuel requirements for all of the 
            modules on your spacecraft when also taking into account 
            the mass of the added fuel?\n
            => Answer: ${fuelRequirements}`);

