const { pwList } = require("./shared");
const possiblePws = pwList();

const reducedPws = [];

const checkForPossibleGroups = digits => {
  const regex = /(.)\1+/g;
  const matches = digits.match(regex);
  const groups = matches.filter(match => match.length <= 2);

  if (groups.length > 0) {
    return digits;
  }

  return false;
};

possiblePws.forEach(pw => {
  const checkedMatch = checkForPossibleGroups(pw.toString());
  if (checkedMatch) {
    reducedPws.push(checkedMatch);
  }
});

console.log("Answer part two:", reducedPws.length);
