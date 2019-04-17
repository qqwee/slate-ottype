import { testDoc } from './fuzzer.test';
import slateType from '../SlateType';

var _ = require('lodash');
var fuzzer = require('ot-fuzzer');
var Value = slateType.Value;
var Operation = slateType.Operation;

const AVAILIBLE_OPS = ['insert_text', 'add_mark'];
const AVAILIBLE_OPS_LEN = AVAILIBLE_OPS.length;

/**
 * Overload slateType create function for easier random op generation
 */
slateType.type.create = function (init) {
        console.log('called create in SlateType');
        init = testDoc;
        return Value.create(init);
}
/**
 * Start from document
 * @param {Value} snapshot
 * @param {Array} leafs
 */
const getAllTextLeafsWithPaths = (tree, path = []) => {
    let array = [];
    if (tree.nodes) {
        tree.nodes.forEach((n, index) => {
            if (n.object === 'text') {
                n.leaves.forEach((l, idx) => {
                    if (l.object === 'leaf') {
                        l.path = [...path, index, idx];
                        array.push(l);
                    }
                })
            } else {
                array = array.concat(getAllTextLeafsWithPaths(n, [...path, index]));
              }
            })
    }
    return array;
};

/**
 * We use the Operations.apply function since we expect the apply function to work in Slate
 * @param {Value} snapshot
 */

var generateRandomOp = function(snapshot) {
    const value = Value.create(snapshot);
    let op = {};
    switch(fuzzer.randomInt(AVAILIBLE_OPS_LEN)) {
      case (0):
        op = generateRandomInsertTextOp(snapshot);
        break
      case (1):
        op = generateRandomAddMarkOp(snapshot);
        break;
      default:
        throw Error('Error generating random op');
    }
    const newSnapshot = op.apply(value);
    return [op, newSnapshot];
};

//get a random path in a snapshot
const getRandomLeafWithPath = (snapshot) => {
    const leaves = getAllTextLeafsWithPaths(snapshot);
    const result = leaves[fuzzer.randomInt(leaves.length)];
    return result;
}

//insert_text: ['path', 'offset', 'text', 'marks', 'data'],
const generateRandomInsertTextOp = (snapshot) => {
    const randomLeaf = getRandomLeafWithPath(snapshot.toJSON().document);
    const randomPath = randomLeaf.path;
    
    const op = Operation.create({
        object: 'operation',
        type: 'insert_text',
        path: randomPath.slice(0, randomPath.length - 1),
        offset: fuzzer.randomInt(randomLeaf.text.length),
        text: fuzzer.randomWord(),
        marks: [...randomLeaf.marks],
        data: {},
    });
    return op;
}

// add_mark: ['path', 'offset', 'length', 'mark', 'data'],
const generateRandomAddMarkOp = (snapshot) => {
  const randomLeaf = getRandomLeafWithPath(snapshot.toJSON().document);
  const randomPath = randomLeaf.path;

  const offset = fuzzer.randomInt(randomLeaf.text.length);
  const op = Operation.create({
      object: 'operation',
      type: 'add_mark',
      path: randomPath.slice(0, randomPath.length - 1),
      offset,
      length: fuzzer.randomInt(randomLeaf.text.length - offset),
      mark: 'random_mark',
      data: {},
  });
  return op;
}

fuzzer(slateType.type, generateRandomOp, 100);

export const dummy = {};