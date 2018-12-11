const R = require('ramda');
const helper = require('./helper');

const parseHand = (hand) => (
  R.reduce(
    (acc, val) => (R.append([R.init(val), R.last(val)], acc)),
    [],
    hand
  )
);

const ranks = R.map((val) => (isNaN(val[0]) ? val[0] : parseInt(val[0])));

const suits = R.map((val) => (val[1]));

const rankFrequencies = (hand) => (
  R.reduce(
    (acc, val) => (
      acc[val] ? R.assoc(val, acc[val] + 1, acc) : R.assoc(val, 1, acc)
    ),
    {},
    hand
  )
);

const isAFlush = (hand) => (suits(hand).every((val, i, arr) => val === arr[0]));

const isAStraight = (hand) => {
  const sortedRanks = ranks(hand);
  sortedRanks.sort(helper.compare);
  const firstRank = sortedRanks[0];
  const expected = R.range(firstRank, firstRank + hand.length);
  return R.equals(sortedRanks, expected);
};

const handRanking = (hand) => {
  const groupSizes = R.pipe(
    ranks,
    rankFrequencies,
    R.values,
    R.sort((a, b) => (b - a)),
    R.filter(R.lt(1))
  );
  return R.cond([
    [R.both(isAFlush, isAStraight), R.always('Straight flush')],
    [R.pipe(groupSizes, R.equals([4])), R.always('Four of a kind')],
    [R.pipe(groupSizes, R.equals([3, 2])), R.always('Full house')],
    [R.pipe(groupSizes, R.equals([3])), R.always('Three of a kind')],
    [R.pipe(groupSizes, R.equals([2, 2])), R.always('Two pair')],
    [R.pipe(groupSizes, R.equals([2])), R.always('One pair')],
    [isAFlush, R.always('Flush')],
    [isAStraight, R.always('Straight')]  // TODO not working for alpha rank
  ])(hand)
};

const inputHand = process.argv[2].split(",")
console.log(handRanking(inputHand));




// ** Ignore **
// poor man's tests
const hand = ["JH", "4C", "4S", "JC", "10H"];
const hand2 = ['10S', '9S', '8S', '7S', '6S'];
const hand3 = ["AH", "KH", "QH", "JH", "10H"];
const hand4 = ["AS", "10S", "7S", "6S", "2S"];
const hand5 = ["5C", "4D", "3S", "2H", "AH"];
const hand6 = ["5C", "5D", "5S", "5H", "AH"];
const hand7 = ["5C", "5D", "5S", "2H", "2S"];

// console.log(isAFlush(parseHand(hand2)));
// console.log(isAStraight(parseHand(hand2)));
// console.log(handRanking(parseHand(hand2)));
// console.log(handRanking(parseHand(hand7)));
// console.log(parseHand(hand));
// console.log(`Ranks: ${ranks(parseHand(hand))}`);
// console.log(`Suits: ${suits(parseHand(hand))}`);
// console.log(rankFrequencies(ranks(parseHand(hand))));
// console.log(handRanking(parseHand(hand6)));
