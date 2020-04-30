import { testDoc } from './fuzzer.test';
import { generateRandomInsertTextOp, generateRandomRemoveTextOp } from './op-generator';
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

// remove text tests
const removeFuzzer = new CustomFuzzer({
  otType: slateType.type,
  iterations: 2000,
  generateRandomOp: snapshot => {
    let op = null;

    // generate either a insert text or remove text
    // since for now these are the only transforms that
    // have been written
    switch (fuzzer.randomInt(2)) {
      case 0:
        op = generateRandomRemoveTextOp(snapshot);
        break;
      case 1:
        op = generateRandomInsertTextOp(snapshot);
        break;
      default:
    }
    return op;
  },
});
removeFuzzer.start();
