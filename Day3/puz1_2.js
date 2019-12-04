const { input } = require("./shared");

const testInput = input.split("\n");

const manhattenDistance = (x1, x2, y1, y2) =>
  Math.abs(x1 - x2) + Math.abs(y1 - y2);

const centralPort = { x: 0, y: 0 };

const totalSteps = {
  w1: 0,
  w2: 0
};

const wires = {
  w1: {
    x: centralPort.x,
    y: centralPort.y,
    coordinates: {}
  },
  w2: {
    x: centralPort.x,
    y: centralPort.y,
    coordinates: {}
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

const storeWayPoints = (steps, wire, axis, direction) => {
  const { x, y } = wires[wire];

  for (let i = 0; i < steps; i++) {
    const key =
      axis === "y" ? `${x};${y + i * direction}` : `${x + i * direction};${y}`;

    totalSteps[wire] += 1;

    wires[wire].coordinates[key] = totalSteps[wire];
    if (wire === "w2" && wires.w1.coordinates[key]) {
      const dynamicIntersectionPoints = {
        x: axis === "x" ? x + i * direction : x,
        y: axis === "y" ? y + i * direction : y
      };

      wires.intersections.push({
        point: `${key}`,
        distance: manhattenDistance(
          dynamicIntersectionPoints.x,
          centralPort.x,
          dynamicIntersectionPoints.y,
          centralPort.y
        ),
        stepsToIntersection:
          wires.w1.coordinates[key] + wires.w2.coordinates[key] - 2
      });
    }
  }
};

const lockPoints = (instructionSet, wire) => {
  instructionSet.forEach(instruction => {
    const { direction, steps } = extractDirectionFromSteps(instruction);

    switch (direction) {
      case "U":
        storeWayPoints(steps, wire, "y", -1);
        wires[wire].y -= steps;
        break;
      case "D":
        storeWayPoints(steps, wire, "y", 1);
        wires[wire].y += steps;
        break;
      case "L":
        storeWayPoints(steps, wire, "x", -1);
        wires[wire].x -= steps;
        break;
      case "R":
        storeWayPoints(steps, wire, "x", 1);
        wires[wire].x += steps;
        break;
      default:
        break;
    }
  });
};

lockPoints(testInput[0].split(","), "w1");
lockPoints(testInput[1].split(","), "w2");

// Calc closest intersection Point
console.log(`What is the Manhattan distance from the central port to the closest intersection?
=> Answer: ${Math.min.apply(
  Math,
  wires.intersections.slice(1).map(intersection => intersection.distance)
)}`);

// calc best intersection point regarding to total steps
console.log(`
What is the fewest combined steps the wires must take to reach an intersection?
=> Answer: ${Math.min.apply(
  Math,
  wires.intersections
    .slice(1)
    .map(intersection => intersection.stepsToIntersection)
)}`);
