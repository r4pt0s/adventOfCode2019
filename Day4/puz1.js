const { pwList } = require("./shared");

console.log(
  `How many different passwords within the range given in your puzzle input meet these criteria?
=> Answer: ${pwList().length}`
);
