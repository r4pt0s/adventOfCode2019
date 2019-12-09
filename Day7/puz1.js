const { softwareController } = require("./shared");

const myInput = [...softwareController]//'3,31,3,32,1002,32,10,32,1001,31,-2,31,1007,31,0,33,1002,33,7,33,1,33,31,31,1,32,31,31,4,31,99,0,0,0'.split(',').map(Number);

let outPutByOpCode4 = [];

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

const program = (phaseInput) => (opcode, instructions, a, b, c, controlSoftware) => {
  const [valueAtPosOne = 0, valueAtPosTwo = 0, replaceValue = 0] = instructions;
  const modeP1 = c === 0 ? Number(controlSoftware[valueAtPosOne]) : Number(valueAtPosOne);
  const modeP2 = b === 0 ? Number(controlSoftware[valueAtPosTwo]) : Number(valueAtPosTwo);
  const returnObject = { method: "software", value: false, controlSoftware: null };


  switch (opcode) {
    case 1:
      controlSoftware[replaceValue] = modeP1 + modeP2;
      break;
    case 2:
      controlSoftware[replaceValue] = modeP1 * modeP2;
      break;
    case 3:
      controlSoftware[valueAtPosOne] = phaseInput.shift();
      break;
    case 4:
      returnObject.method = 'output';
      returnObject.value = controlSoftware[valueAtPosOne];
      outPutByOpCode4.push(controlSoftware[valueAtPosOne]);
      break;

    case 5:
      returnObject.method = 'jump';
      returnObject.value = modeP1 !== 0 ? modeP2 : false;
      break;
    case 6:
      returnObject.method = 'jump';
      returnObject.value = modeP1 === 0 ? modeP2 : false;
      break;
    case 7:
      controlSoftware[replaceValue] = modeP1 < modeP2 ? 1 : 0;
      break;
    case 8:
      controlSoftware[replaceValue] = modeP1 === modeP2 ? 1 : 0;
      break;
    case 99:
      returnObject.method = "halt";
      returnObject.value = controlSoftware[0];
      break;
    default:
      console.log("ENCOUNTERED SOMEThING WENT WRONG: ", instructions);
      break;
  }

  returnObject.controlSoftware = controlSoftware;

  //console.log(controlSoftware);

  return returnObject;
};

const intCodeComputer = (programWithInput, controlSoftware) => {
  let instructionPointer = 0;
  let halt = false;
  let tweakInstructionPointer = false;
  const iterationCount = controlSoftware.length;

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

  while (instructionPointer < iterationCount && !halt) {
    instructionMarker = Number(controlSoftware[instructionPointer]);
    let { opCode, a, b, c } = extractParameterModeParts(instructionMarker);
    tweakInstructionPointer = false;
    const instructions = controlSoftware.slice(
      instructionPointer + 1,
      instructionPointer + opCodeParamsCount[`opcode${opCode}`] + 1
    );

    console.log(
      "instructionMarker: ",
      Number(controlSoftware[instructionPointer]),
      "instruction Pointer: ",
      instructionPointer,
      "opCode: ",
      opCode,
      " a: ",
      a,
      " b: ",
      b,
      "c: ",
      c,
      "opCodeParamsCount: ",
      opCodeParamsCount[`opcode${opCode}`],
      "instructions: ",
      instructions,
      "\n"
    );

    returnObject = programWithInput(
      opCode, instructions
      ,
      a,
      b,
      c,
      controlSoftware
    );

    switch (returnObject.method) {
      case 'jump':
        if (returnObject.value !== false) {
          instructionPointer = returnObject.value;
        } else {
          instructionPointer += opCodeParamsCount[`opcode${opCode}`] + 1;
        }
        break;
      case 'output':
        return returnObject.value;
      case 'halt':
        return returnObject.value;
      default:
        instructionPointer += opCodeParamsCount[`opcode${opCode}`] + 1;
        break;
    }

    controlSoftware = returnObject.controlSoftware;
  }

};


//Thanks to stackovewflow => https://stackoverflow.com/a/49652789
function arrayCreate(array, size) {
  var result = [];
  array.forEach(function iter(parts) {
    return function (v) {
      var temp = parts.concat(v);
      if (parts.includes(v)) {
        return;
      }
      if (temp.length === size) {
        result.push(temp);
        return;
      }
      array.forEach(iter(temp));
    }
  }([]));
  return result;
}


const possiblePhases = arrayCreate([0, 1, 2, 3, 4], 5);
const signals = [];

possiblePhases.forEach(phases => {
  const amp1 = intCodeComputer(program([phases[0], 0]), [...myInput]);
  const amp2 = intCodeComputer(program([phases[1], amp1]), [...myInput]);
  const amp3 = intCodeComputer(program([phases[2], amp2]), [...myInput]);
  const amp4 = intCodeComputer(program([phases[3], amp3]), [...myInput]);
  const amp5 = intCodeComputer(program([phases[4], amp4]), [...myInput]);

  signals.push(amp5);
})

console.log(Math.max(...signals));

