const { input, intCodeComputer } = require("./shared");

console.log(`What value is left at position 0 after the program halts?
=> Answer: ${intCodeComputer(12, 2, [...input])}`);
