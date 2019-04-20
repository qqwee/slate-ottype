import { testDoc } from './fuzzer.test';
import { generateRandomAddMarkOp, generateRandomOp } from './op-generator';
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
const addMarkFuzzer = new CustomFuzzer({
  otType: slateType.type,
  iterations: 1000,
  generateRandomOp: generateRandomAddMarkOp,
});

const op1 = Operation.create({
  object: 'operation',
  type: 'add_mark',
  path: [0, 0],
  offset: 5,
  length: 4,
  mark: 'mark1',
  data: {}
});

const op2 = Operation.create({
  object: 'operation',
  type: 'add_mark',
  path: [0, 0],
  offset: 5,
  length: 4,
  mark: 'mark2',
  data: {}
});

console.log("add_mark, add_mark sorted marks test");
assert(addMarkFuzzer.singleTransformCheck({ op1, op2, side: 'left' }), 'add_mark, add_mark left');
assert(addMarkFuzzer.singleTransformCheck({ op1, op2, side: 'right' }), 'add_mark, add_mark right');
console.log('========= PASSED =========');

console.log(JSON.stringify(slateType.type.serialize(addMarkFuzzer.start())));

// Uncomment to see how two add_mark add_mark fails
// without lead mark sorting
// without sorting leaf marks
// slateType.type.apply = function(snapshot, op) {
//   let value = Value.create(snapshot);
//   const operation = Operation.create(op);
//   value = operation.apply(value);
//   // value = Value.create(normalizeSnapShot(value));
//   return value;
// }

// console.log("add_mark, add_mark noSort tests");
// cf.singleTransformCheck({ op1, op2, side: 'left' });
// cf.singleTransformCheck({ op1, op2, side: 'right' });

const basicFuzzer = new CustomFuzzer({
  otType: slateType.type,
  iterations: 100,
  generateRandomOp,
});

let i = 0;
while (i < 100) {
  basicFuzzer.start();
  i++;
}