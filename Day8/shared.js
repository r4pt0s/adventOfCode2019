const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("");

const dimension = {
  width: 25,
  height: 6
};

module.exports = {
  image: input,
  dimension
};
