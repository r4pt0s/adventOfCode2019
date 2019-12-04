const checkForSameAdjacent = digits => {
  const regex = /(.)\1+/g;

  if (!digits.match(regex)) {
    return false;
  }
  return true;
};

const checkForIncreasingNumbers = digits => {
  const pw = [];

  for (let i = 0; i < digits.length - 1; i++) {
    if (digits[i] < digits[i + 1] || digits[i + 1] === digits[i]) {
      pw.push(digits[i]);
    } else {
      return false;
    }
  }

  return true;
};

const pwList = () => {
  const pwRange = "240298-784956";
  const [pwStartRange, pwEndRange] = pwRange.split("-");

  const possiblePasswords = [];

  for (let i = pwStartRange; i <= pwEndRange; i++) {
    if (checkForSameAdjacent(i.toString())) {
      if (checkForIncreasingNumbers(i.toString())) {
        possiblePasswords.push(i);
      }
    }
  }

  return possiblePasswords;
};

module.exports = {
  pwList
};
