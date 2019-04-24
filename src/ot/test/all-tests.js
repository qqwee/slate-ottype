import { testDoc } from './fuzzer.test';
import { generateRandomOp } from './op-generator';
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

const basicFuzzer = new CustomFuzzer({
  otType: slateType.type,
  iterations: 100,
  generateRandomOp,
});

basicFuzzer.start();

require('./add-mark');
require('./remove-text');
