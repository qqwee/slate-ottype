var _ = require('lodash');
var { testDoc } = require('./fuzzer.test');
var expect = require('chai').expect;
var fuzzer = require('ot-fuzzer');
var slateType = require('../SlateType');
var Value = slateType.Value;
var Operation = slateType.Operation;

const AVAILIBLE_OPS = ['insert_text'];
const AVAILIBLE_OPS_LEN = AVAILIBLE_OPS.length;

/**
 * Overload slateType create function for easier random op generation
 */
slateType.type.create = function (init) {
        console.log('called create in SlateType');    
        init = testDoc;  
        // console.log(JSON.parse(JSON.stringify(Value.create(init).toJSON())));
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
    console.log('Generating random operation');
    // console.log(snapshot);
    const value = Value.create(snapshot);
    let op = {};
    switch(fuzzer.randomInt(AVAILIBLE_OPS_LEN)) {
        case (0):
            op = generateRandomInsertTextOp(snapshot);
            break
    }
    const newSnapshot = op.apply(value);
    return [op, newSnapshot];
};

//get a random path in a snapshot
const getRandomLeafWithPath = (snapshot) => {
    // console.log(snapshot);
    console.log('getting random leaf with path');
    const leaves = getAllTextLeafsWithPaths(snapshot);
    result = leaves[fuzzer.randomInt(leaves.length)];
    return result;
}

//insert_text: ['path', 'offset', 'text', 'marks', 'data'],
const generateRandomInsertTextOp = (snapshot) => {
   
    console.log('generate random insert text operation');
    // console.log(snapshot.toJSON().document);
    const randomLeaf = getRandomLeafWithPath(snapshot.toJSON().document);
    const randomPath = randomLeaf.path;

    const op = Operation.create({
        object: 'operation',
        type: 'insert_text',
        path: randomPath.slice(1),
        offset: fuzzer.randomInt(randomLeaf.text.length),
        text: fuzzer.randomWord(),
        marks: [...randomLeaf.marks],
        data: {},
    });
    return op;
}

fuzzer(slateType.type, generateRandomOp, 100);
/*
module.exports = {
    getAllTextLeafsWithPaths,
}*/