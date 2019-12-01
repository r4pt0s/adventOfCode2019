const fs = require("fs");
const input = fs.readFileSync("input.txt", 'utf8').split('\n');
const calculateFuel = (mass) => Math.floor(mass / 3) - 2;


module.exports = {
  calculateFuel,
  input
};
