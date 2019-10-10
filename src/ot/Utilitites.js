var { isImmutable } = require('immutable');

export const normalizeSnapShot = snapShot => {
  let o = snapShot;
  if (isImmutable(snapShot)) {
    o = snapShot.toJSON();
  }
  // sortMarksOnEachLeaf(o.document);
  return o;
};

const sortMarksOnEachLeaf = tree => {
  if (tree && tree.nodes) {
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

export const isArray = obj => {
  return Object.prototype.toString.call(obj) == '[object Array]';
};
