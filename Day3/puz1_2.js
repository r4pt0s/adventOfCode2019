const { input } = require("./shared");

const testInput = input.split("\n");
/* const testInput = `R75,D30,R83,U83,L12,D49,R71,U7,L72
U62,R66,U55,R34,D71,R55,D58,R83`.split("\n"); */

const manhattenDistance = (x1, x2, y1, y2) =>
  Math.abs(x1 - x2) + Math.abs(y1 - y2);

const centralPort = { x: 0, y: 0 };

const wires = {
  w1: {
    x: centralPort.x,
    y: centralPort.y,
    coordinates: [],
    totalSteps: []
  },
  w2: {
    x: centralPort.x,
    y: centralPort.y,
    coordinates: [],
    totalSteps: []
  },
  intersections: []
};

const extractDirectionFromSteps = instruction => {
  const regex = /[^A-Z][0-9]*/gm;

  return {
    direction: instruction[0],
    steps: Number(instruction.match(regex)[0])
  };
};

const lockPoints = (instructionSet, wire) => {
  instructionSet.forEach(instruction => {
    const { direction, steps } = extractDirectionFromSteps(instruction);

    console.log("calc");

    switch (direction) {
      case "U":
        for (let i = 0; i < steps; i++) {
          wires[wire].coordinates.push(`${wires[wire].x};${wires[wire].y - i}`);
          if (wire === "w2") {
            if (
              wires.w1.coordinates.includes(
                `${wires[wire].x};${wires[wire].y - i}`
              )
            ) {
              wires.intersections.push({
                point: `${wires[wire].x};${wires[wire].y - i}`,
                distance: manhattenDistance(
                  wires[wire].x,
                  centralPort.x,
                  wires[wire].y - i,
                  centralPort.y
                ),
                indexStore: {
                  w1: wires.w1.coordinates.indexOf(
                    `${wires[wire].x};${wires[wire].y - i}`
                  ),
                  w2: wires.w2.coordinates.indexOf(
                    `${wires[wire].x};${wires[wire].y - i}`
                  )
                }
              });
            }
          }
        }
        wires[wire].y -= steps;
        break;
      case "D":
        for (let i = 0; i < steps; i++) {
          wires[wire].coordinates.push(`${wires[wire].x};${wires[wire].y + i}`);
          if (wire === "w2") {
            if (
              wires.w1.coordinates.includes(
                `${wires[wire].x};${wires[wire].y + i}`
              )
            ) {
              wires.intersections.push({
                point: `${wires[wire].x};${wires[wire].y + i}`,
                distance: manhattenDistance(
                  wires[wire].x,
                  centralPort.x,
                  wires[wire].y + i,
                  centralPort.y
                ),
                indexStore: {
                  w1: wires.w1.coordinates.indexOf(
                    `${wires[wire].x};${wires[wire].y + i}`
                  ),
                  w2: wires.w2.coordinates.indexOf(
                    `${wires[wire].x};${wires[wire].y + i}`
                  )
                }
              });
            }
          }
        }
        wires[wire].y += steps;
        break;
      case "L":
        for (let i = 0; i < steps; i++) {
          wires[wire].coordinates.push(`${wires[wire].x - i};${wires[wire].y}`);
          if (wire === "w2") {
            if (
              wires.w1.coordinates.includes(
                `${wires[wire].x - i};${wires[wire].y}`
              )
            ) {
              wires.intersections.push({
                point: `${wires[wire].x - i};${wires[wire].y}`,
                distance: manhattenDistance(
                  wires[wire].x - i,
                  centralPort.x,
                  wires[wire].y,
                  centralPort.y
                ),
                indexStore: {
                  w1: wires.w1.coordinates.indexOf(
                    `${wires[wire].x - i};${wires[wire].y}`
                  ),
                  w2: wires.w2.coordinates.indexOf(
                    `${wires[wire].x - i};${wires[wire].y}`
                  )
                }
              });
            }
          }
        }
        wires[wire].x -= steps;
        break;
      case "R":
        for (let i = 0; i < steps; i++) {
          wires[wire].coordinates.push(`${wires[wire].x + i};${wires[wire].y}`);
          if (wire === "w2") {
            if (
              wires.w1.coordinates.includes(
                `${wires[wire].x + i};${wires[wire].y}`
              )
            ) {
              wires.intersections.push({
                point: `${wires[wire].x - +i};${wires[wire].y}`,
                distance: manhattenDistance(
                  wires[wire].x + i,
                  centralPort.x,
                  wires[wire].y,
                  centralPort.y
                ),
                indexStore: {
                  w1: wires.w1.coordinates.indexOf(
                    `${wires[wire].x + i};${wires[wire].y}`
                  ),
                  w2: wires.w2.coordinates.indexOf(
                    `${wires[wire].x + i};${wires[wire].y}`
                  )
                }
              });
            }
          }
        }
        wires[wire].x += steps;
        break;
      default:
        break;
    }
    wires[wire].totalSteps.push(steps);
  });

  console.log(wires[wire].coordinates);
};

lockPoints(testInput[0].split(","), "w1");
lockPoints(testInput[1].split(","), "w2");

console.log(wires.intersections);

// Calc closest intersection Point
console.log(
  Math.min.apply(
    Math,
    wires.intersections.slice(1).map(intersection => intersection.distance)
  )
);

// calc best intersection point regarding to total steps
console.log(
  Math.min.apply(
    Math,
    wires.intersections
      .slice(1)
      .map(
        intersection => intersection.indexStore.w1 + intersection.indexStore.w2
      )
  )
);
