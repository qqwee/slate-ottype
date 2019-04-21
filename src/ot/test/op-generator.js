import slateType from '../SlateType';
import fuzzer from 'ot-fuzzer';

const Value = slateType.Value;
const Operation = slateType.Operation;

const AVAILIBLE_OPS = ['insert_text', 'remove_text'];
const AVAILIBLE_OPS_LEN = AVAILIBLE_OPS.length;
const MARKS = ['mark1', 'mark2', 'mark3', 'mark4', 'mark5'];

/**
 * Start from document
 * @param {Value} snapshot
 * @param {Array} leafs
 */
export const getAllTextLeafsWithPaths = (tree, path = []) => {
    let array = [];
    if (tree.nodes) {
        tree.nodes.forEach((n, index) => {
            if (n.object === 'text') {
                n.leaves.forEach((l, idx) => {
                    if (l.object === 'leaf') {
                        l.path = [...path, index, idx];
                        array.push(l);
                    }
                });
            } else {
                array = array.concat(
                    getAllTextLeafsWithPaths(n, [...path, index])
                );
            }
        });
    }
  return array;
};

/**
* We use the Operations.apply function since we expect the apply function to work in Slate
* @param {Value} snapshot
*/
export const generateRandomOp = function(snapshot) {
    let op = {};
    switch (fuzzer.randomInt(AVAILIBLE_OPS_LEN)) {
        case 0:
            op = generateRandomInsertTextOp(snapshot);
            break;
        case 1:
            op = generateRandomAddMarkOp(snapshot);
            break;
        default:
            throw Error('Error generating random op');
    }
    return op; 
};

/**
* We use the Operations.apply function since we expect the apply function to work in Slate
* @param {Value} snapshot
*/
export const generateAndApplyRandomOp = function(snapshot) {
    const value = Value.create(snapshot);
    let op = {};
    switch (fuzzer.randomInt(AVAILIBLE_OPS_LEN)) {
        case 0:
            op = generateRandomInsertTextOp(snapshot);
            break;
        case 1:
            op = generateRandomRemoveText(snapshot);
            break;
        default:
            throw Error('Error generating random op');
    }
    const newSnapshot = op.apply(value);
    return [op, newSnapshot];
};

/**
 * Get a random leaf given a snapshot
 * @param {Value} snapshot 
 */
export const getRandomLeafWithPath = snapshot => {
    const leaves = getAllTextLeafsWithPaths(snapshot);
    const result = leaves[fuzzer.randomInt(leaves.length)];
    return result;
};

// insert_text: ['path', 'offset', 'text', 'marks', 'data'],
export const generateRandomInsertTextOp = snapshot => {
    const randomLeaf = getRandomLeafWithPath(snapshot.toJSON().document);
    const randomPath = randomLeaf.path;

    const op = Operation.create({
        object: 'operation',
        type: 'insert_text',
        path: randomPath.slice(0, randomPath.length - 1),
        offset: fuzzer.randomInt(randomLeaf.text.length),
        text: fuzzer.randomWord(),
        marks: [...randomLeaf.marks],
        data: {}
    });
    return op;
};

// remove_text: ['path', 'offset', 'text', 'marks', 'data'],
export const generateRandomRemoveText = snapshot => {
    const randomLeaf = getRandomLeafWithPath(snapshot.toJSON().document);
    const randomPath = randomLeaf.path;

    const offset = fuzzer.randomInt(randomLeaf.text.length);
    const textLength = fuzzer.randomInt(randomLeaf.text.length - offset);
    const text = randomLeaf.text.slice(offset, textLength);

    const op = Operation.create({
        object: 'operation',
        type: 'remove_text',
        path: randomPath.slice(0, randomPath.length - 1),
        offset,
        text,
        marks: [...randomLeaf.marks],
        data: {}
    });
    return op;
};

// add_mark: ['path', 'offset', 'length', 'mark', 'data'],
export const generateRandomAddMarkOp = snapshot => {
    const randomLeaf = getRandomLeafWithPath(snapshot.toJSON().document);
    const randomPath = randomLeaf.path;

    const offset = fuzzer.randomInt(randomLeaf.text.length);
    const op = Operation.create({
        object: 'operation',
        type: 'add_mark',
        path: randomPath.slice(0, randomPath.length - 1),
        offset,
        length: fuzzer.randomInt(randomLeaf.text.length - offset),
        mark: MARKS[fuzzer.randomInt(MARKS.length)],
        data: {}
    });
    return op;
};

// remove_mark: ['path', 'offset', 'length', 'mark', 'data'],
export const generateRandomRemoveMarkOp = snapshot => {
    const randomLeaf = getRandomLeafWithPath(snapshot.toJSON().document);
    const randomPath = randomLeaf.path;

    const offset = fuzzer.randomInt(randomLeaf.text.length);
    const op = Operation.create({
        object: 'operation',
        type: 'remove_mark',
        path: randomPath.slice(0, randomPath.length - 1),
        offset,
        length: fuzzer.randomInt(randomLeaf.text.length - offset),
        mark: MARKS[fuzzer.randomInt(MARKS.length)],
        data: {}
    });
    return op;
}