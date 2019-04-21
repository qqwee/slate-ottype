import { testDoc } from './fuzzer.test';
import { generateRandomInsertTextOp, generateRandomRemoveText } from './op-generator';
import slateType from '../SlateType';
import CustomFuzzer from './custom-fuzzer';

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
// remove text tests
const removeFuzzer = new CustomFuzzer({
  otType: slateType.type,
  iterations: 1000,
  generateRandomOp: (snapshot) => {
    let op = null;

    // alternate so that we create two remove text ops
    // followed by two insert text ops
    if ((counter % 4) < 2) {
      op = generateRandomRemoveText(snapshot);
    } else {
      op = generateRandomInsertTextOp(snapshot);
    }
    
    counter++;
    return op;
  },
})
removeFuzzer.start();
