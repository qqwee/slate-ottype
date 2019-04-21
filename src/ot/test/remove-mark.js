import { testDoc } from './fuzzer.test';
import {
  generateRandomAddMarkOp,
  generateRandomRemoveMarkOp,
  generateRandomInsertTextOp,
} from './op-generator';
import slateType from '../SlateType';
import CustomFuzzer from './custom-fuzzer';

const Value = slateType.Value;

const assert = require('assert');
const { Operation } = require('slate');

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
  generateRandomOp: (snapshot) => {
    counter++;
    if (counter < 3) {
      return generateRandomAddMarkOp(snapshot);
    } else {
      if (counter === 4) counter = 0;
      return generateRandomRemoveMarkOp(snapshot);
    }
  },
})
removeMarkFuzzer.start();

counter = 0;
// remove mark tests
const removeMarkInsertTextFuzzer = new CustomFuzzer({
  otType: slateType.type,
  iterations: 1000,
  generateRandomOp: (snapshot) => {
    counter++;
    if (counter < 3) {
      return generateRandomInsertTextOp(snapshot);
    } else if (counter < 5) {
      return generateRandomAddMarkOp(snapshot);
    } else {
      if (counter === 7) counter = 0;
      return generateRandomRemoveMarkOp(snapshot);
    }
  },
})
removeMarkInsertTextFuzzer.start();