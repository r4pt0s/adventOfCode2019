const { input, intCodeComputer } = require("./shared");

// desired output : 19690720

for (let noun = 0; noun <= 99; noun++) {
  for (let verb = 0; verb <= 99; verb++) {
    const result = intCodeComputer(noun, verb, [...input]);

    if (result === 19690720) {
      console.log(`What is (n * noun + verb) === 19690720?
=> Answer: ${noun} ${verb} (Answer without whitespace)`);
      break;
    }
  }
}
