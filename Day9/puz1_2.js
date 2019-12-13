let { input } = require("./shared");

const opCodeParamsCount = {
  opcode0: 3,
  opcode1: 3,
  opcode2: 3,
  opcode3: 1,
  opcode4: 1,
  opcode5: 2,
  opcode6: 2,
  opcode7: 3,
  opcode8: 3,
  opcode9: 1,
  opCode99: 0
};

let outPutByOpCode4 = [];

let relativeBase = 0;
let instructionPointer = 0;


const calcModes = modeString => {
  const modeStringLastElement = modeString.length - 1;

  const slots = {
    opCode: Number(`${modeString[modeStringLastElement - 1] || ''}${modeString[modeStringLastElement]}`),
    modes: [
      Number(modeString[modeStringLastElement - 4]) || 0,
      Number(modeString[modeStringLastElement - 3]) || 0,
      Number(modeString[modeStringLastElement - 2]) || 0
    ]
  }

  return slots;
}

const program = (opcode, instructions, a, b, c, phase, controlSoftware) => {
  const [valueAtPosOne = 0, valueAtPosTwo = 0, replaceValue = 0] = instructions;

  const addressByMode = (mode, index) => {

    return (mode === 2 ? Number(relativeBase) : 0) + Number(index);
  }

  const valueByMode = (mode, index) => {

    return mode === 1 ? Number(index) : Number(controlSoftware[getAddress(mode, index)]) || 0;
  }


  switch (opcode) {
    case 1:
      controlSoftware[addressByMode(a, replaceValue)] = valueByMode(c, valueAtPosOne) + valueByMode(b, valueAtPosTwo);
      break;
    case 2:
      controlSoftware[addressByMode(a, replaceValue)] = valueByMode(c, valueAtPosOne) * valueByMode(b, valueAtPosTwo);
      break;
    case 3:
      controlSoftware[addressByMode(c, valueAtPosOne)] = phase;
      break;
    case 4:
      outPutByOpCode4.push(valueByMode(c, valueAtPosOne));
      break;
    case 5:
      if (valueByMode(c, valueAtPosOne) !== 0) {
        instructionPointer = valueByMode(b, valueAtPosTwo);
        return;
      }
      break;
    case 6:
      if (valueByMode(c, valueAtPosOne) === 0) {
        instructionPointer = valueByMode(b, valueAtPosTwo);
        return;
      }
      break;
    case 7:
      controlSoftware[addressByMode(a, replaceValue)] = valueByMode(c, valueAtPosOne) < valueByMode(b, valueAtPosTwo) ? 1 : 0;
      break;
    case 8:
      controlSoftware[addressByMode(a, replaceValue)] = valueByMode(c, valueAtPosOne) === valueByMode(b, valueAtPosTwo) ? 1 : 0;
      break;
    case 9:
      relativeBase += valueByMode(c, valueAtPosOne);
      break;
    case 99:
      return controlSoftware[0];
    default:
      console.log("ENCOUNTERED SOMEThING WENT WRONG: ", instructions);
      break;
  }

  instructionPointer += opCodeParamsCount[`opcode${opcode}`] + 1;

  return false;
};

const intCodeComputer = (controlSoftware, phase) => {
  let halt = false;


  while (instructionPointer < controlSoftware.length && !halt) {
    instructionMarker = controlSoftware[instructionPointer];
    let { opCode, modes } = calcModes(instructionMarker.toString());
    tweakInstructionPointer = false;

    if (Number(opCode) === 99) {
      halt = true;
    }

    tweakInstructionPointer = program(
      opCode,
      controlSoftware.slice(
        instructionPointer + 1,
        instructionPointer + opCodeParamsCount[`opcode${opCode}`] + 1
      ),
      modes[0],
      modes[1],
      modes[2],
      phase,
      controlSoftware
    );

  }

};

intCodeComputer([...input], 1);

console.log("Answer Part 1: ", outPutByOpCode4);

outPutByOpCode4 = [];
instructionPointer = 0;
relativeBase = 0;

intCodeComputer([...input], 2);
console.log("Answer Part 2: ", outPutByOpCode4);
