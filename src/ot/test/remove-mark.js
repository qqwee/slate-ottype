import { testDoc } from './fuzzer.test';
import { generateRandomAddMarkOp, generateRandomRemoveMarkOp, generateRandomInsertTextOp } from './op-generator';
import slateType from '../SlateType';
import CustomFuzzer from './custom-fuzzer';

const fuzzer = require('ot-fuzzer');
const Value = slateType.Value;

/**
 * Overload slateType create function for easier random op generation
 */
slateType.type.create = function(init) {
  console.log('called create in SlateType');
  init = testDoc;
  return Value.create(init);
};

let counter = 0;
// remove mark tests
const removeMarkFuzzer = new CustomFuzzer({
  otType: slateType.type,
  iterations: 1000,
  generateRandomOp: snapshot => {
    counter++;
    if (counter < 3) {
      return generateRandomAddMarkOp(snapshot);
    } else {
      if (counter === 4) counter = 0;
      return generateRandomRemoveMarkOp(snapshot);
    }
  },
});
removeMarkFuzzer.start();

// remove mark tests
const removeMarkInsertTextFuzzer = new CustomFuzzer({
  otType: slateType.type,
  iterations: 1000,
  generateRandomOp: snapshot => {
    let op;
    switch (fuzzer.randomInt(3)) {
      case 0:
        console.log('insert text');
        op = generateRandomInsertTextOp(snapshot);
        break;
      case 1:
        console.log('add mark');
        op = generateRandomAddMarkOp(snapshot);
        break;
      case 2:
        console.log('remove mark');
        op = generateRandomRemoveMarkOp(snapshot);
        break;
      default:
    }
    return op;
  },
});
removeMarkInsertTextFuzzer.start();
