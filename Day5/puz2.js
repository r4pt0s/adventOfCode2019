const { input } = require("./shared");
const outPutByOpCode4 = [];

const extractParameterModeParts = instruction => {
  const arrayVersion = instruction.toString().split("");
  const slots = {
    opCode: Number(arrayVersion.splice(-2, 2).join("")),
    c: Number(arrayVersion.pop()) || 0,
    b: Number(arrayVersion.pop()) || 0,
    a: Number(arrayVersion.pop()) || 0
  };

  console.log(slots);

  return slots;
};

const program = (opcode, instructions, a, b, c) => {
  console.log("instructions: ", instructions);
  const [valueAtPosOne = 0, valueAtPosTwo = 0, replaceValue = 0] = instructions;
  const modeP1 = c === 0 ? Number(input[valueAtPosOne]) : Number(valueAtPosOne);
  const modeP2 = b === 0 ? Number(input[valueAtPosTwo]) : Number(valueAtPosTwo);

  switch (opcode) {
    case 1:
      input[replaceValue] = modeP1 + modeP2;
      break;
    case 2:
      input[replaceValue] = modeP1 * modeP2;
      break;
    case 3:
      input[valueAtPosOne] = 5;
      break;
    case 4:
      outPutByOpCode4.push(input[valueAtPosOne]);
      break;

    case 5:
      return modeP1 !== 0 ? modeP2 : false;
    case 6:
      return modeP1 === 0 ? modeP2 : false;
    case 7:
      input[replaceValue] = modeP1 < modeP2 ? 1 : 0;
      break;
    case 8:
      input[replaceValue] = modeP1 === modeP2 ? 1 : 0;
      break;
    case 99:
      return input[0];
    default:
      console.log("ENCOUNTERED SOMEThING WENT WRONG: ", instructions);
      break;
  }
};

const intCodeComputer = () => {
  let instructionPointer = 0;
  let halt = false;
  let tweakInstructionPointer = false;

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
    opCode99: 0
  };

  while (instructionPointer < input.length && !halt) {
    instructionMarker = Number(input[instructionPointer]);
    let { opCode, a, b, c } = extractParameterModeParts(instructionMarker);
    tweakInstructionPointer = false;

    console.log(
      "instructionMarker: ",
      Number(input[instructionPointer]),
      "instruction Pointer: ",
      instructionPointer,
      "opCode: ",
      opCode,
      "opCodeParamsCount: ",
      opCodeParamsCount[`opcode${opCode}`],
      "\n"
    );

    if (opCode === 99) {
      console.log("Diagnostic code: ", outPutByOpCode4.pop());
      halt = true;
    }

    tweakInstructionPointer = program(
      opCode,
      input.slice(
        instructionPointer + 1,
        instructionPointer + opCodeParamsCount[`opcode${opCode}`] + 1
      ),
      a,
      b,
      c
    );

    if (tweakInstructionPointer) {
      instructionPointer = tweakInstructionPointer;
    } else {
      instructionPointer += opCodeParamsCount[`opcode${opCode}`] + 1;
    }
  }
};

intCodeComputer();
