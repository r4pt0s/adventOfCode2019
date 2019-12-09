const { image, dimension } = require("./shared");

const processImageDataToLayer = image => {
  const processed = [];

  const layers = [];

  while (image.length) {
    processed.push(image.splice(0, dimension.width));
  }

  for (let i = 0; i < dimension.width * dimension.height; i++) {
    const line = processed.splice(0, dimension.height);
    layers.push(
      line.reduce((oneLayer, currLine) => [...oneLayer, ...currLine], [])
    );
  }

  return layers;
};

const buildImage = image => {
  const layers = processImageDataToLayer(image);
  const resultImage = [];

  for (
    let pixelPos = 0;
    pixelPos < dimension.width * dimension.height;
    pixelPos++
  ) {
    for (let t = 0; t < layers.length; t++) {
      if (resultImage[pixelPos] !== undefined) {
        if (resultImage[pixelPos] === "2") {
          resultImage[pixelPos] =
            layers[t][pixelPos] === "2"
              ? resultImage[pixelPos]
              : layers[t][pixelPos];
        }
      } else {
        resultImage.push(layers[t][pixelPos]);
      }
    }
  }

  return resultImage;
};

const drawImage = imageToDraw => {
  let chars = "";
  let line = 1;

  for (let k = 0; k < imageToDraw.length; k++) {
    chars += imageToDraw[k] === "1" ? "*" : " ";
    if (line === dimension.width) {
      chars += "\n";
      line = 0;
    }
    line++;
  }

  return chars;
};

console.log(
  `What message is produced after decoding your image?
=> Answer:\n${drawImage(buildImage(image))}`
);
