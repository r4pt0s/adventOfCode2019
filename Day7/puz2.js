const { softwareController } = require("./shared");

let myInput = null;

let outPutByOpCode4 = [0];

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
      if (phaseInput.length > 1)
        controlSoftware[valueAtPosOne] = phaseInput.shift();
      else
        controlSoftware[valueAtPosOne] = phaseInput[0];
      break;
    case 4:
      returnObject.method = 'output';
      returnObject.value = controlSoftware[valueAtPosOne];
      break;

    case 5:
      returnObject.method = 'jump';
      returnObject.value = modeP1 > 0 ? modeP2 : false;
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
        outPutByOpCode4.push(returnObject.value)
        instructionPointer += opCodeParamsCount[`opcode${opCode}`] + 1;
        break;
      case 'halt':
        //return returnObject.value;
        halt = true;
      default:
        instructionPointer += opCodeParamsCount[`opcode${opCode}`] + 1;
        break;
    }

    controlSoftware = returnObject.controlSoftware;
  }

  return controlSoftware;

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


const possibleEvaluatedPhases = arrayCreate([5, 6, 7, 8, 9], 5);
const signals = [];
let amp1 = null;
let amp2 = null;
let amp3 = null;
let amp4 = null;
let amp5 = 0;

amp5 = '3,26,1001,26,-4,26,3,27,1002,27,2,27,1,27,26,27,4,27,1001,28,-1,28,1005,28,6,99,0,0,5'.split(',').map(Number);
const sequenz = [9, 8, 7, 6, 5];

while (outPutByOpCode4[outPutByOpCode4.length - 1] !== NaN) {
  amp1 = intCodeComputer(program([sequenz[0], outPutByOpCode4.pop()]), amp5);
  amp2 = intCodeComputer(program([sequenz[1], outPutByOpCode4.pop()]), amp1);
  amp3 = intCodeComputer(program([sequenz[2], outPutByOpCode4.pop()]), amp2);
  amp4 = intCodeComputer(program([sequenz[3], outPutByOpCode4.pop()]), amp3);
  amp5 = intCodeComputer(program([sequenz[4], outPutByOpCode4.pop()]), amp4);
}

console.log(outPutByOpCode4);

/* possibleEvaluatedPhases.forEach((phases, i) => {

  amp5 = 0;
  while (i < 5) {
    console.log(`start with amp5: ${amp5}`)
    amp1 = intCodeComputer(program([phases[0], amp5]), myInput);
    amp2 = intCodeComputer(program([phases[1], amp1]), myInput);
    amp3 = intCodeComputer(program([phases[2], amp2]), myInput);
    amp4 = intCodeComputer(program([phases[3], amp3]), myInput);
    amp5 = intCodeComputer(program([phases[4], amp4]), myInput);
  }
  signals.push(amp5);
})
 */

//139629729
//console.log(signals);

