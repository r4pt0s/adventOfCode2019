const fs = require("fs");
const input = fs
  .readFileSync("input.txt", "utf8")
  .split(",")
  .map(Number);

const intCodeComputer = (noun, verb, memory) => {
  const stepForward = 4;
  let currIntcodeStart = 0;
  let currIntcodeEnd = 4;
  memory[1] = noun;
  memory[2] = verb;

  do {
    const [opCode, valueAtPosOne, valueAtPosTwo, replaceValue] = memory.slice(
      currIntcodeStart,
      currIntcodeEnd
    );

    switch (opCode) {
      case 1:
        memory[replaceValue] = memory[valueAtPosOne] + memory[valueAtPosTwo];
        break;
      case 2:
        memory[replaceValue] = memory[valueAtPosOne] * memory[valueAtPosTwo];
        break;
      case 99:
        return memory[0];
      default:
        console.log("ENCOUNTERED SOMEThING WENT WRONG");
        break;
    }

    currIntcodeStart += stepForward;
    currIntcodeEnd += stepForward;
  } while (true);
};

module.exports = {
  input,
  intCodeComputer
};
