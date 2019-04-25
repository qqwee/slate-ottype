import { testDoc } from './fuzzer.test';
import {
  generateRandomInsertNodeOp,
  generateRandomInsertTextOp,
  generateRandomRemoveTextOp,
  generateRandomAddMarkOp,
  getRandomLeafWithPath,
  generateRandomRemoveNodeOp,
} from './op-generator';
import slateType from '../SlateType';
import CustomFuzzer from './custom-fuzzer';
import fuzzer from 'ot-fuzzer';

const Value = slateType.Value;

/**
 * Overload slateType create function for easier random op generation
 */
slateType.type.create = function(init) {
  console.log('called create in SlateType');
  init = testDoc;
  return Value.create(init);
};

const generateRandomOp = snapshot => {
  // don't allow for remove node ops if document is empty
  if (snapshot.document.nodes.size === 0) {
    return generateRandomInsertNodeOp(snapshot);
  }
  // make sure random leaf exists
  // if not, insert a new node
  const randomLeaf = getRandomLeafWithPath(snapshot.toJSON().document);
  if (!randomLeaf) {
    return generateRandomInsertNodeOp(snapshot);
  }

  let op;
  switch (fuzzer.randomInt(4)) {
    case 0:
      op = generateRandomRemoveNodeOp(snapshot);
      break;
    case 1:
      op = generateRandomInsertNodeOp(snapshot);
      break;
    case 2:
      op = generateRandomInsertTextOp(snapshot, randomLeaf);
      break;
    // todo: add support for remove_text add_mark
    // case 3:
    //   op = generateRandomRemoveTextOp(snapshot, randomLeaf);
    //   break;
    case 3:
      op = generateRandomAddMarkOp(snapshot, randomLeaf);
      break;
  }
  return op;
};

export const generateAndApplyRandomOp = function(snapshot) {
  const value = Value.create(snapshot);
  const op = generateRandomOp(snapshot);
  const newSnapshot = op.apply(value);
  return [[op], newSnapshot];
};

const insertNodeFuzzer = new CustomFuzzer({
  otType: slateType.type,
  iterations: 1000,
  generateRandomOp,
});
// run custom fuzzer tests
insertNodeFuzzer.start();

fuzzer(slateType.type, generateAndApplyRandomOp, 300);
