var { isImmutable } = require('immutable');
var { Value } = require('slate');

export const normalizeSnapShot = snapShot => {
    let o = snapShot;
    if (isImmutable(snapShot)) {
        o = snapShot.toJSON();
    }
    sortMarksOnEachLeaf(o.document);
    return o;
};

const sortMarksOnEachLeaf = tree => {
    if (tree.nodes) {
        tree.nodes.forEach(n => {
            if (n.object === 'text') {
                n.leaves.forEach(l => {
                    if (l.object === 'leaf') {
                        l.marks = l.marks.sort((a, b) => a.type.localeCompare(b.type));
                    }
                });
            } else {
                sortMarksOnEachLeaf(n);
            }
        });
    }
    return tree;
};

// NOTE: just a simple test

// import { testDoc } from './test/fuzzer.test';

// const test = Value.create(testDoc);

// console.log(normalizeSnapShot(test).document.nodes[0].nodes[0].leaves[0].marks);
