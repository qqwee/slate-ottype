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
    counter++;
    if (counter < 3) {
      return generateRandomRemoveText(snapshot);
    } else {
      if (counter === 4) counter = 0;
      return generateRandomInsertTextOp(snapshot);
    }
  },
})
removeFuzzer.start();
