const { input } = require('./shared');

const testInput = input.split('\n');
/* const testInput = `R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51
U98,R91,D20,R16,D67,R40,U7,R15,U6,R7`.split('\n');
 */
const manhattenDistance = (x1, x2, y1, y2) => Math.abs(x1 - x2) + Math.abs(y1 - y2);

const centralPort = { x: 0, y: 0 };


const wires = {
  w1: {
    x: centralPort.x,
    y: centralPort.y,
    coordinates: []
  },
  w2: {
    x: centralPort.x,
    y: centralPort.y,
    coordinates: []
  },
  intersections: []
}

const extractDirectionFromSteps = instruction => {
  const regex = /[^A-Z][0-9]*/gm;

  return {
    direction: instruction[0],
    steps: Number(instruction.match(regex)[0])
  }
}

const calculatePathPoints = (points, steps, axis) => {
  const wayPoints = {};

  for (let i = points[axis]; i < steps; i++) {
    wayPoints[``]
  }
}

const lockPoints = (instructionSet, wire) => {

  instructionSet.forEach(instruction => {
    const { direction, steps } = extractDirectionFromSteps(instruction);

    console.log("calc");

    switch (direction) {
      case 'U':
        for (let i = 0; i < steps; i++) {
          wires[wire].coordinates.push(`${wires[wire].x};${wires[wire].y - i}`)
          if (wire === 'w2') {
            if (wires.w1.coordinates.includes(`${wires[wire].x};${wires[wire].y - i}`)) {
              wires.intersections.push({
                point: `${wires[wire].x};${wires[wire].y - i}`,
                distance: manhattenDistance(wires[wire].x, centralPort.x, (wires[wire].y - i), centralPort.y)
              })
            }
          }
        }
        wires[wire].y -= steps;
        break;
      case 'D':
        for (let i = 0; i < steps; i++) {
          wires[wire].coordinates.push(`${wires[wire].x};${wires[wire].y + i}`)
          if (wire === 'w2') {
            if (wires.w1.coordinates.includes(`${wires[wire].x};${wires[wire].y + i}`)) {
              wires.intersections.push({
                point: `${wires[wire].x};${wires[wire].y + i}`,
                distance: manhattenDistance(wires[wire].x, centralPort.x, (wires[wire].y + i), centralPort.y)
              })
            }
          }
        }
        wires[wire].y += steps;
        break;
      case 'L':
        for (let i = 0; i < steps; i++) {
          wires[wire].coordinates.push(`${wires[wire].x - i};${wires[wire].y}`)
          if (wire === 'w2') {
            if (wires.w1.coordinates.includes(`${wires[wire].x - i};${wires[wire].y}`)) {
              wires.intersections.push({
                point: `${wires[wire].x - i};${wires[wire].y}`,
                distance: manhattenDistance((wires[wire].x - i), centralPort.x, wires[wire].y, centralPort.y)
              })
            }
          }
        }
        wires[wire].x -= steps;
        break;
      case 'R':
        for (let i = 0; i < steps; i++) {
          wires[wire].coordinates.push(`${wires[wire].x + i};${wires[wire].y}`)
          if (wire === 'w2') {
            if (wires.w1.coordinates.includes(`${wires[wire].x + i};${wires[wire].y}`)) {
              wires.intersections.push({
                point: `${wires[wire].x - +i};${wires[wire].y}`,
                distance: manhattenDistance((wires[wire].x + i), centralPort.x, wires[wire].y, centralPort.y)
              })
            }
          }
        }
        wires[wire].x += steps;
        break;
      default:
        break;
    }

  });

  console.log(wires[wire].coordinates);

}

lockPoints(testInput[0].split(','), 'w1');
lockPoints(testInput[1].split(','), 'w2');


/* const intersections = wires.w2.coordinates.reduce((acc, wayPoint) => {
  //console.log('intersections');
  if (wires.w1.coordinates.find(wayPoint1 => wayPoint === wayPoint1)) {
    const [x, y] = wayPoint.split(';');
    acc.push({ point: wayPoint, distance: manhattenDistance(x, centralPort.x, y, centralPort.y) });
  }

  return acc;
}, []);
 */


console.log(wires.intersections);

console.log(Math.min.apply(Math, wires.intersections.slice(1).map(intersection => intersection.distance)));