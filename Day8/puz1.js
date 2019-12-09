const { image, dimension } = require("./shared");
const processed = [];

const processImageDataToLayer = image => {
  const layers = [];

  while (image.length) {
    processed.push(image.splice(0, dimension.width));
  }

  for (let i = 0; i < processed.length / dimension.height + 1; i++) {
    const line = processed.splice(0, dimension.height);
    layers.push(
      line.reduce((oneLayer, currLine) => [...oneLayer, ...currLine], [])
    );
  }

  return layers;
};

const countSpecificNumber = (arr, searchNumber) =>
  arr.map(layer => layer.filter(num => num === searchNumber.toString()).length);

const decryptImage = image => {
  const layers = processImageDataToLayer(image);

  const layerFewestZeros = countSpecificNumber(layers, 0);
  const findIndex = layerFewestZeros.indexOf(Math.min(...layerFewestZeros));

  const result =
    countSpecificNumber([layers[findIndex]], 1)[0] *
    countSpecificNumber([layers[findIndex]], 2)[0];

  return result;
};

console.log(
  `To make sure the image wasn't corrupted during transmission, the Elves would like you to find the layer that contains the fewest 0 digits. 
  On that layer, what is the number of 1 digits multiplied by the number of 2 digits?
=> Answer: ${decryptImage(image)}`
);
