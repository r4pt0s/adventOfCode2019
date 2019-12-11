const { softwareController } = require("./shared");

const extractParameterModeParts = instruction => {
  const arrayVersion = instruction.toString().split("");
  const slots = {
    opCode: Number(arrayVersion.splice(-2, 2).join("")),
    c: Number(arrayVersion.pop()) || 0,
    b: Number(arrayVersion.pop()) || 0,
    a: Number(arrayVersion.pop()) || 0
  };
  return slots;
};

const program = (opcode, instructions, a, b, c, controlSoftware, input) => {
  const [valueAtPosOne = 0, valueAtPosTwo = 0, replaceValue = 0] = instructions;
  const modeP1 =
    c === 0 ? Number(controlSoftware[valueAtPosOne]) : Number(valueAtPosOne);
  const modeP2 =
    b === 0 ? Number(controlSoftware[valueAtPosTwo]) : Number(valueAtPosTwo);
  const returnObject = {
    method: "software",
    value: false,
    controlSoftware: null
  };

  switch (opcode) {
    case 1:
      controlSoftware[replaceValue] = modeP1 + modeP2;
      break;
    case 2:
      controlSoftware[replaceValue] = modeP1 * modeP2;
      break;
    case 3:
      console.log("set input: ", input);
      controlSoftware[valueAtPosOne] = input;
      break;
    case 4:
      returnObject.method = "output";
      returnObject.value = controlSoftware[valueAtPosOne];
      break;
    case 5:
      returnObject.method = "jump";
      returnObject.value = modeP1 !== 0 ? modeP2 : false;
      break;
    case 6:
      returnObject.method = "jump";
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

  return returnObject;
};

let outPutByOpCode4 = [0];

function* intCodeComputer(controlSoftware) {
  let instructionPointer = 0;
  let halt = false;
  const iterationCount = controlSoftware.length;
  let returnObject = null;

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
    opCode99: 1
  };

  let phaseSetting = yield "ACCEPTING PHASE SETTING";

  let input = phaseSetting;

  while (instructionPointer < iterationCount && !halt) {
    instructionMarker = Number(controlSoftware[instructionPointer]);
    let { opCode, a, b, c } = extractParameterModeParts(instructionMarker);
    tweakInstructionPointer = false;
    const instructions = controlSoftware.slice(
      instructionPointer + 1,
      instructionPointer + opCodeParamsCount[`opcode${opCode}`] + 1
    );

    if (opCode === 3 && phaseSetting === null) {
      console.log("STOP AND WAIT FOR INPUT");
      input = yield "accepting";
      console.log("RECEIVED INPUT: ", input);
    } else {
      phaseSetting = null;
    }

    returnObject = program(
      opCode,
      instructions,
      a,
      b,
      c,
      controlSoftware,
      input
    );

    switch (returnObject.method) {
      case "jump":
        if (returnObject.value !== false) {
          instructionPointer = returnObject.value;
        } else {
          instructionPointer += opCodeParamsCount[`opcode${opCode}`] + 1;
        }
        break;
      case "output":
        controlSoftware = returnObject.controlSoftware;
        outPutByOpCode4.push(returnObject.value);
        instructionPointer += opCodeParamsCount[`opcode${opCode}`] + 1;
        break;
      case "halt":
        halt = true;
        return outPutByOpCode4;
      default:
        instructionPointer += opCodeParamsCount[`opcode${opCode}`] + 1;
        break;
    }

    controlSoftware = returnObject.controlSoftware;
  }

  return { controlSoftware, returnObject };
}

const possibleEvaluatedPhases = arrayCreate([5, 6, 7, 8, 9], 5);

signals = possibleEvaluatedPhases.map((sequenz, j) => {
  let amp1 = intCodeComputer([...softwareController], "sequenz for amp1");
  let amp2 = intCodeComputer([...softwareController], "sequenz for amp2");
  let amp3 = intCodeComputer([...softwareController], "sequenz for amp3");
  let amp4 = intCodeComputer([...softwareController], "sequenz for amp4");
  let amp5 = intCodeComputer([...softwareController], "sequenz for amp5");

  let checker = false;

  let output = {
    value: 0
  };
  const doneStates = {
    amp1: false,
    amp2: false,
    amp3: false,
    amp4: false,
    amp5: false
  };
  outPutByOpCode4 = [0];

  amp1.next(); // START THE GENERATOR AMP 1
  amp2.next(); // START THE GENERATOR AMP 2
  amp3.next(); // START THE GENERATOR AMP 3
  amp4.next(); // START THE GENERATOR AMP 4
  amp5.next(); // START THE GENERATOR AMP 5

  // SETTING THE PHASE => all generators at listening state
  genamp1 = amp1.next(sequenz[0]);
  genamp2 = amp2.next(sequenz[1]);
  genamp3 = amp3.next(sequenz[2]);
  genamp4 = amp4.next(sequenz[3]);
  genamp5 = amp5.next(sequenz[4]);

  while (!checker) {
    output = amp1.next(outPutByOpCode4.pop());

    console.log(output);

    if (output.done) {
      doneStates.amp1 = true;
    }

    output = amp2.next(outPutByOpCode4.pop());

    console.log(output);

    if (output.done) {
      doneStates.amp2 = true;
    }

    output = amp3.next(outPutByOpCode4.pop());

    console.log(output);

    if (output.done) {
      doneStates.amp3 = true;
    }

    output = amp4.next(outPutByOpCode4.pop());

    console.log(output);
    if (output.done) {
      doneStates.amp4 = true;
    }

    output = amp5.next(outPutByOpCode4.pop());

    console.log(output);

    if (output.done) {
      doneStates.amp5 = true;
    }

    checker =
      doneStates.amp1 &&
      doneStates.amp2 &&
      doneStates.amp3 &&
      doneStates.amp4 &&
      doneStates.amp5
        ? true
        : false;
  }

  return output.value;
});

console.log(Math.max(...signals));

//Thanks to stackovewflow => https://stackoverflow.com/a/49652789
function arrayCreate(array, size) {
  var result = [];
  array.forEach(
    (function iter(parts) {
      return function(v) {
        var temp = parts.concat(v);
        if (parts.includes(v)) {
          return;
        }
        if (temp.length === size) {
          result.push(temp);
          return;
        }
        array.forEach(iter(temp));
      };
    })([])
  );
  return result;
}
