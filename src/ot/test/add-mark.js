import { testDoc } from './fuzzer.test';
import { generateRandomAddMarkOp, generateRandomOp, generateRandomInsertTextOp, generateRandomRemoveText } from './op-generator';
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

// run remaining add mark tests
addMarkFuzzer.start();
