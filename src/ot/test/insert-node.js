import { testDoc } from './fuzzer.test';
import {
  generateRandomInsertNodeOp,
  generateRandomOp,
  generateRandomInsertTextOp,
  generateRandomRemoveText,
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

const insertNodeFuzzer = new CustomFuzzer({
  otType: slateType.type,
  iterations: 1000,
  generateRandomOp: snapshot => {
    // don't allow for remove node ops if document is empty
    if (snapshot.document.nodes.size === 0) return generateRandomInsertNodeOp(snapshot);

    let op;
    switch (fuzzer.randomInt(3)) {
      case 0:
        op = generateRandomRemoveNodeOp(snapshot);
        break;
      case 1:
        op = generateRandomInsertNodeOp(snapshot);
        break;
      case 2: {
        const randomLeaf = getRandomLeafWithPath(snapshot.toJSON().document);
        if (randomLeaf) {
          op = generateRandomInsertTextOp(snapshot);
        } else {
          op = generateRandomInsertNodeOp(snapshot);
        }
        break;
      }
    }
    return op;
  },
});

// run fuzzer tests
insertNodeFuzzer.start();
