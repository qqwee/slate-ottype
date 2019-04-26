var { Operation, PathUtils, Mark } = require('slate');

const insertNodeTransformHelper = (op1, insertNodeOp) => {
  const newPath = PathUtils.transform(op1.get('path'), insertNodeOp).get(0);
  if (newPath) {
    return Operation.create({
      ...op1.toJSON(),
      path: newPath,
    });
  }

  return op1;
};

const removeNodeTransformHelper = (op1, removeNodeOp) => {
  const newPath = PathUtils.transform(op1.get('path'), removeNodeOp).get(0);
  if (newPath) {
    return Operation.create({
      ...op1.toJSON(),
      path: newPath,
    });
  }

  const nodeIsBeingRemoved =
    PathUtils.isAbove(removeNodeOp.get('path'), op1.get('path')) ||
    PathUtils.compare(op1.get('path'), removeNodeOp.get('path')) === 0;
  if (nodeIsBeingRemoved) {
    return [];
  }

  return op1;
};

/**
PathUtils exports ...
export default {
    compare(path, target)
        compares path and target, returns null if same first part but different size
    create(attr)
        changes [] or List([]) to List([]) for paths
    crop(a, b, size=min(a, b))
        crop paths a, b so that they are the same size, shortest len. returne [ca, cb]
    decrement(path, n=1, index = path.size -1)
        decrease path by n at index, default last element
    increment(path, n=1, index=path.size -1)
        increment path by n at index.   
    getAncestors(path)
        eg: [1,2,3] returns [[1], [1,2], [1,2,3]]
    isAbove(path, target)
        expresses height parent and child
    isAfter(path, target)
        compare on the same level
    isBefore(path, target)
        compare on the same level
    isEqual(path, target)
        exactly equal
    isOlder(p, t)
        if true: paths are equal up to last index, where pLast > tLast
    isSibling(p, t)
        checks that p[0:-1] equals t[0:-1]
    isYounger(p, t)
        if true: path are equal up to last index, pLast < tLast
    lift(p)
        returns [0:-1] up to parent 
    drop(p)
        returns [1:] removes the first element
    max(a,b)
        maximum SIZE of a or b
    min(a, b)
        min SIZE of a or b
    relate(a,b)
        get largest common path ie:
        [1,2,3,6], [1,2,3,8] => [1,2,3] 
    transform(path, operation)
        transforms path to adjust to be current
  }

 */

const OperationTypes = {
  INSERT_TEXT: 'insert_text',
  REMOVE_TEXT: 'remove_text',

  ADD_MARK: 'add_mark',
  REMOVE_MARK: 'remove_mark',
  SET_MARK: 'set_mark',

  INSERT_NODE: 'insert_node',
  MERGE_NODE: 'merge_node',
  MOVE_NODE: 'move_node',
  REMOVE_NODE: 'remove_node',
  SET_NODE: 'set_node',
  SPLIT_NODE: 'split_node',
  /**
   * These operations we can actually omit
   */
  SET_SELECTION: 'set_selection',
  SET_VALUE: 'set_value',
};

/**
 * TODO: delete this after usage, just more information on existing keys in different operations
 */
// const OPERATION_ATTRIBUTES = {
//   add_mark: ['path', 'offset', 'length', 'mark', 'data'],
//   insert_node: ['path', 'node', 'data'],
//   insert_text: ['path', 'offset', 'text', 'marks', 'data'],
//   merge_node: ['path', 'position', 'properties', 'target', 'data'],
//   move_node: ['path', 'newPath', 'data'],
//   remove_mark: ['path', 'offset', 'length', 'mark', 'data'],
//   remove_node: ['path', 'node', 'data'],
//   remove_text: ['path', 'offset', 'text', 'marks', 'data'],
//   set_mark: ['path', 'offset', 'length', 'properties', 'newProperties', 'data'],
//   set_node: ['path', 'properties', 'newProperties', 'data'],
//   set_selection: ['properties', 'newProperties', 'data'],
//   set_value: ['properties', 'newProperties', 'data'],
//   split_node: ['path', 'position', 'properties', 'target', 'data'],
// }
const Transform = {
  //insert_text: ['path', 'offset', 'text', 'marks', 'data'],
  // Insert_text as first operator
  /**
   * [insert_text, insert_text] transformation.
   * @param {Operation} op1
   * @param {Operation} op2
   * @param {String} side
   */
  transformInsTextInsText: (op1, op2, side) => {
    const pathCompare = PathUtils.compare(op1.get('path'), op2.get('path'));
    if (pathCompare === 0) {
      if (op1.get('offset') < op2.get('offset') || (op1.get('offset') === op2.get('offset') && side === 'left')) {
        return op1;
      } else {
        return Operation.create({
          object: 'operation',
          type: 'insert_text',
          path: op1.get('path'),
          offset: op1.get('offset') + op2.get('text').length,
          text: op1.get('text'),
          marks: op1.get('marks'),
          data: op1.get('data'),
        });
      }
    } else {
      return op1;
    }
  },

  /**
   * [insert_text, remove_text] transformation.
   * @param {Operation} op1
   * @param {Operation} op2
   * @param {String} side
   */
  transformInsTextRemoveText: (op1, op2, side) => {
    const pathCompare = PathUtils.compare(op1.get('path'), op2.get('path'));
    if (pathCompare === 0) {
      const op1StartPoint = op1.get('offset');

      const op2Len = op2.get('text').length;
      const op2StartPoint = op2.get('offset');
      const op2EndPoint = op2StartPoint + op2Len;

      // if op1 happens completely before op2
      // no transforming is needed
      if (op1StartPoint <= op2StartPoint) {
        return op1;
      }
      // if op1 happens completely after op2
      // just shift the offset by the length of op2's text
      if (op1StartPoint >= op2EndPoint) {
        return Operation.create({
          object: 'operation',
          type: 'insert_text',
          path: op1.get('path'),
          offset: op1.get('offset') - op2.get('text').length,
          text: op1.get('text'),
          marks: op1.get('marks'),
          data: op1.get('data'),
        });
      }

      // handle case where there is an overlap
      return Operation.create({
        object: 'operation',
        type: 'insert_text',
        path: op1.get('path'),
        offset: op1.get('offset') - op2StartPoint + op1StartPoint,
        text: '',
        marks: op1.get('marks'),
        data: op1.get('data'),
      });
    }

    return op1;
  },

  transformRemoveTextRemoveText(op1, op2, side) {
    const pathCompare = PathUtils.compare(op1.get('path'), op2.get('path'));
    if (pathCompare === 0) {
      const op1Len = op1.get('text').length;
      const op1StartPoint = op1.get('offset');
      const op1EndPoint = op1StartPoint + op1Len;

      const op2Len = op2.get('text').length;
      const op2StartPoint = op2.get('offset');
      const op2EndPoint = op2StartPoint + op2Len;

      // if op1 happens completely before op2
      // no transforming is needed
      if (op1EndPoint <= op2StartPoint) {
        return op1;
      }
      // if op1 happens completely after op2
      // just shift the offset by the length of op2's text
      if (op1StartPoint >= op2EndPoint) {
        return Operation.create({
          object: 'operation',
          type: 'remove_text',
          path: op1.get('path'),
          offset: op1.get('offset') - op2.get('text').length,
          text: op1.get('text'),
          marks: op1.get('marks'),
          data: op1.get('data'),
        });
      }

      // otherwise handle complicated overlap
      // calculate left and right text
      // and shift operation by the difference in starting pionts
      const leftTextEnd = Math.max(op2StartPoint - op1StartPoint, 0);
      const leftText = op1.get('text').slice(0, leftTextEnd);
      const rightTextStart = Math.min(op1Len, op1Len - (op1EndPoint - op2EndPoint));
      const rightText = op1.get('text').slice(rightTextStart, op1Len);

      return Operation.create({
        object: 'operation',
        type: 'remove_text',
        path: op1.get('path'),
        offset: op1.get('offset') - Math.max(0, op1StartPoint - op2StartPoint),
        text: leftText + rightText,
        marks: op1.get('marks'),
        data: op1.get('data'),
      });
    }

    return op1;
  },

  /**
   * [insert_text, add_mark] transformation.
   * @param {Operation} op1
   * @param {Operation} op2
   * @param {String} side
   */
  transformInsTextAddMark: (op1, op2, side) => {
    const pathCompare = PathUtils.compare(op1.get('path'), op2.get('path'));
    if (pathCompare === 0) {
      // insert text happens completely before mark
      if (op1.get('offset') <= op2.get('offset')) {
        return op1;
      }
      // insert text happens completely after mark
      else if (op1.get('offset') >= op2.get('offset') + op2.get('length')) {
        return op1;
      }
      // insert text happens overlapping mark
      else {
        const mark = op2.get('mark');
        let newMarks = op1.get('marks');
        newMarks = newMarks.add(Mark.create({ type: mark.type, data: {} }));
        return Operation.create({
          object: 'operation',
          type: 'insert_text',
          path: op1.get('path'),
          offset: op1.get('offset'),
          text: op1.get('text'),
          marks: newMarks,
          data: op1.get('data'),
        });
      }
    }

    return op1;
  },

  /**
   * [add_mark, insert_text] transformation.
   * @param {Operation} op1
   * @param {Operation} op2
   * @param {String} side
   */
  transformAddMarkInsText: (op1, op2, side) => {
    const pathCompare = PathUtils.compare(op1.get('path'), op2.get('path'));
    if (pathCompare === 0) {
      // add mark happens completely before insert
      if (op1.get('offset') + op1.get('length') <= op2.get('offset')) {
        return op1;
      }
      // add mark happens overlapping insert text
      else if (op1.get('offset') < op2.get('offset')) {
        return Operation.create({
          object: 'operation',
          type: 'add_mark',
          path: op1.get('path'),
          offset: op1.get('offset'),
          length: op1.get('length') + op2.get('text').length,
          mark: op1.get('mark'),
          data: op1.get('data'),
        });
      }
      // add mark happens completely after insert
      else {
        return Operation.create({
          object: 'operation',
          type: 'add_mark',
          path: op1.get('path'),
          offset: op1.get('offset') + op2.get('text').length,
          length: op1.get('length'),
          mark: op1.get('mark'),
          data: op1.get('data'),
        });
      }
    }

    return op1;
  },

  /**
   * [remove_mark, insert_text] transformation.
   * @param {Operation} op1
   * @param {Operation} op2
   * @param {String} side
   */
  transformRemoveMarkInsText: (op1, op2, side) => {
    const pathCompare = PathUtils.compare(op1.get('path'), op2.get('path'));
    if (pathCompare === 0) {
      // remove mark happens completely before insert
      if (op1.get('offset') + op1.get('length') <= op2.get('offset')) {
        return op1;
      }
      // remove mark happens overlapping insert text
      else if (op1.get('offset') < op2.get('offset')) {
        return Operation.create({
          object: 'operation',
          type: 'remove_mark',
          path: op1.get('path'),
          offset: op1.get('offset'),
          length: op1.get('length') + op2.get('text').length,
          mark: op1.get('mark'),
          data: op1.get('data'),
        });
      }
      // remove mark happens completely after insert
      else {
        return Operation.create({
          object: 'operation',
          type: 'remove_mark',
          path: op1.get('path'),
          offset: op1.get('offset') + op2.get('text').length,
          length: op1.get('length'),
          mark: op1.get('mark'),
          data: op1.get('data'),
        });
      }
    }

    return op1;
  },

  /**
   * [insert_text, remove_mark] transformation.
   * @param {Operation} op1
   * @param {Operation} op2
   * @param {String} side
   */
  transformInsTextRemoveMark: (op1, op2, side) => {
    const pathCompare = PathUtils.compare(op1.get('path'), op2.get('path'));
    if (pathCompare === 0) {
      // insert text happens completely before remove mark
      if (op1.get('offset') <= op2.get('offset')) {
        return op1;
      }
      // insert text happens completely after remove mark
      else if (op1.get('offset') >= op2.get('offset') + op2.get('length')) {
        return op1;
      }
      // insert text happens overlapping remove mark
      else {
        const mark = op2.get('mark');
        let newMarks = op1.get('marks').filterNot(e => e.get('type') === mark.get('type'));
        return Operation.create({
          object: 'operation',
          type: 'insert_text',
          path: op1.get('path'),
          offset: op1.get('offset'),
          text: op1.get('text'),
          marks: newMarks,
          data: op1.get('data'),
        });
      }
    }

    return op1;
  },

  /**
   * [add_mark, add_mark] transformation.
   * @param {Operation} op1
   * @param {Operation} op2
   * @param {String} side
   */
  transformAddMarkAddMark: (op1, op2, side) => {
    return op1;
  },

  /**
   * [add_mark, add_mark] transformation.
   * @param {Operation} op1
   * @param {Operation} op2
   * @param {String} side
   */
  transformRemoveMarkRemoveMark: (op1, op2, side) => {
    return op1;
  },

  /**
   * [add_mark, remove_mark] transformation.
   * @param {Operation} op1
   * @param {Operation} op2
   * @param {String} side
   */
  transformAddMarkRemoveMark: (op1, op2, side) => {
    return op1;
  },

  /**
   * [remove_mark, add_mark] transformation.
   * @param {Operation} op1
   * @param {Operation} op2
   * @param {String} side
   */
  transformRemoveMarkAddMark: (op1, op2, side) => {
    return op1;
  },

  //     /**
  //      * [insert_text, remove_mark] transformation.
  //      * @param {Operation} op1
  //      * @param {Operation} op2
  //      * @param {String} side
  //      */
  //     static transformInsTextRemoveMark(op1, op2, side) {

  //     }

  //     /**
  //      * [insert_text, set_mark] transformation.
  //      * @param {Operation} op1
  //      * @param {Operation} op2
  //      * @param {String} side
  //      */
  //     static transformInsTextSetMark(op1, op2, side) {

  //     }

  //     /**
  //      * [insert_text, insert_node] transformation.
  //      * @param {Operation} op1
  //      * @param {Operation} op2
  //      * @param {String} side
  //      */
  //     static transformInsTextInsNode(op1, op2, side) {
  //     }

  //     /**
  //      * [insert_text, merge_node] transformation.
  //      * @param {Operation} op1
  //      * @param {Operation} op2
  //      * @param {String} side
  //      */
  //     static transformInsTextMergeNode(op1, op2, side) {
  //     }

  //     /**
  //      * [insert_text, move_node] transformation.
  //      * @param {Operation} op1
  //      * @param {Operation} op2
  //      * @param {String} side
  //      */
  //     static transformInsTextMoveNode(op1, op2, side) {
  //     }

  //     /**
  //      * [insert_text, remove_node] transformation.
  //      * @param {Operation} op1
  //      * @param {Operation} op2
  //      * @param {String} side
  //      */
  //     static transformInsTextRemoveNode(op1, op2, side) {
  //     }

  //     /**
  //      * [insert_text, set_node] transformation.
  //      * @param {Operation} op1
  //      * @param {Operation} op2
  //      * @param {String} side
  //      */
  //     static transformInsTextSetNode(op1, op2, side) {
  //     }

  //     /**
  //      * [insert_text, split_node] transformation.
  //      * @param {Operation} op1
  //      * @param {Operation} op2
  //      * @param {String} side
  //      */
  //     static transformInsTextSplitNode(op1, op2, side) {
  //     }

  //     /**
  //      * [insert_text, set_selection] transformation.
  //      * @param {Operation} op1
  //      * @param {Operation} op2
  //      * @param {String} side
  //      */
  //     static transformInsTextSetSelection(op1, op2, side) {
  //     }

  //     /**
  //      * [insert_text, set_value] transformation.
  //      * @param {Operation} op1
  //      * @param {Operation} op2
  //      * @param {String} side
  //      */
  //     static transformInsTextSetValue(op1, op2, side) {
  //     }
  //  Remove_text as first operator.
  /**
   * [remove_text, insert_text] transformation.
   * @param {Operation} op1
   * @param {Operation} op2
   * @param {String} side
   */
  transformRemoveTextInsertText: (op1, op2, side) => {
    const pathCompare = PathUtils.compare(op1.get('path'), op2.get('path'));
    if (pathCompare === 0) {
      const op1Len = op1.get('text').length;
      const op1StartPoint = op1.get('offset');
      const op1EndPoint = op1StartPoint + op1Len;

      const op2StartPoint = op2.get('offset');

      // if op1 happens completely before op2
      // no transforming is needed
      if (op1EndPoint <= op2StartPoint) {
        return op1;
      }
      // if op1 happens completely after op2
      // just shift the offset by the length of op2's text
      if (op1StartPoint >= op2StartPoint) {
        return Operation.create({
          object: 'operation',
          type: 'remove_text',
          path: op1.get('path'),
          offset: op1.get('offset') + op2.get('text').length,
          text: op1.get('text'),
          marks: op1.get('marks'),
          data: op1.get('data'),
        });
      }

      // handle the case where the remove text is surrounding
      // the text that was inserted
      const intersectingIndex = op2StartPoint - op1StartPoint;
      const leftText = op1.get('text').slice(0, intersectingIndex);
      const rightText = op1.get('text').slice(intersectingIndex, op1Len);
      return Operation.create({
        object: 'operation',
        type: 'remove_text',
        path: op1.get('path'),
        offset: op1.get('offset'),
        text: leftText + op2.get('text') + rightText,
        marks: op1.get('marks'),
        data: op1.get('data'),
      });
    }

    return op1;
  },

  /**
   * [insert_node, insert_node] transformation.
   * @param {Operation} op1
   * @param {Operation} op2
   * @param {String} side
   */
  transformInsertNodeInsertNode: (op1, op2, side) => {
    const pathCompare = PathUtils.compare(op1.get('path'), op2.get('path'));
    // handle ties
    if (pathCompare === 0 || (op1.get('path').size === 0 && op2.get('path').size === 0)) {
      if (side === 'left') {
        return op1;
      }
    }

    const newPathArray = PathUtils.transform(op1.get('path'), op2);
    return Operation.create({
      object: 'operation',
      type: 'insert_node',
      path: newPathArray.get(0),
      data: op1.get('data'),
      node: op1.get('node'),
    });
  },

  /**
   * [insert_node, remove_node] transformation.
   * @param {Operation} op1
   * @param {Operation} op2
   * @param {String} side
   */
  transformInsertNodeRemoveNode: (op1, op2, side) => {
    const newPath = PathUtils.transform(op1.get('path'), op2).get(0);
    if (newPath) {
      return Operation.create({
        object: 'operation',
        type: 'insert_node',
        path: newPath,
        data: op1.get('data'),
        node: op1.get('node'),
      });
    }

    if (PathUtils.isAbove(op2.get('path'), op1.get('path'))) {
      return [];
    }

    return op1;
  },

  /**
   * [insert_node, insert_text] transformation.
   * @param {Operation} op1
   * @param {Operation} op2
   * @param {String} side
   */
  transformInsertNodeInsertText: op1 => op1,

  /**
   * [insert_text, insert_node] transformation.
   */
  transformInsTextInsertNode: insertNodeTransformHelper,

  /**
   * [insert_node, remove_text] transformation.
   */
  transformInsertNodeRemoveText: op1 => op1,

  /**
   * [remove_text, insert_node] transformation.
   */
  transformRemoveTextInsertNode: insertNodeTransformHelper,
  /**
   * [insert_node, add_mark] transformation.
   * @param {Operation} op1
   * @param {Operation} op2
   * @param {String} side
   */
  transformInsertNodeAddMark: op1 => op1,

  /**
   * [add_mark, insert_node] transformation.
   */
  transformAddMarkInsertNode: insertNodeTransformHelper,

  /**
   * [insert_node, add_mark] transformation.
   */
  transformInsertNodeRemoveMark: op1 => op1,

  /**
   * [add_mark, insert_node] transformation.
   */
  transformRemoveMarkInsertNode: insertNodeTransformHelper,

  /**
   * [remove_node, add_mark] transformation.
   */
  transformRemoveNodeAddMark: op1 => op1,

  /**
   * [add_mark, remove_node] transformation.
   */
  transformAddMarkRemoveNode: removeNodeTransformHelper,

  /**
   * [remove_node, remove_mark] transformation.
   */
  transformRemoveNodeRemoveMark: op1 => op1,

  /**
   * [remove_mark, remove_node] transformation.
   */
  transformRemoveMarkRemoveNode: removeNodeTransformHelper,

  /**
   * [remove_node, insert_text] transformation.
   */
  transformRemoveNodeInsertText: (op1, op2, side) => {
    return op1;
  },

  /**
   * [insert_text, remove_node] transformation.
   */
  transformInsTextRemoveNode: removeNodeTransformHelper,

  /**
   * [remove_node, remove_text] transformation.
   */
  transformRemoveNodeRemoveText: op1 => op1,

  /**
   * [remove_text, remove_node] transformation.
   */
  transformRemoveTextRemoveNode: removeNodeTransformHelper,

  /**
   * [remove_node, insert_node] transformation.
   * @param {Operation} op1
   * @param {Operation} op2
   * @param {String} side
   */
  transformRemoveNodeInsertNode: (op1, op2, side) => {
    const newPath = PathUtils.transform(op1.get('path'), op2).get(0);
    if (newPath) {
      return Operation.create({
        object: 'operation',
        type: 'remove_node',
        path: newPath,
        data: op1.get('data'),
      });
    }

    return op1;
  },

  transformRemoveNodeRemoveNode: (op1, op2, side) => {
    const pathCompare = PathUtils.compare(op1.get('path'), op2.get('path'));
    // handle ties
    if (pathCompare === 0) {
      return [];
    }

    const newPath = PathUtils.transform(op1.get('path'), op2).get(0);
    if (newPath) {
      return Operation.create({
        object: 'operation',
        type: 'remove_node',
        path: newPath,
        data: op1.get('data'),
        node: op1.get('node'),
      });
    }

    return [];
  },

  //   insert_text: ['path', 'offset', 'text', 'marks', 'data'],
  //   remove_text: ['path', 'offset', 'text', 'marks', 'data'],

  //   add_mark: ['path', 'offset', 'length', 'mark', 'data'],
  //   remove_mark: ['path', 'offset', 'length', 'mark', 'data'],
  //   set_mark: ['path', 'offset', 'length', 'properties', 'newProperties', 'data'],

  //   insert_node: ['path', 'node', 'data'],
  //   merge_node: ['path', 'position', 'properties', 'target', 'data'],
  //   move_node: ['path', 'newPath', 'data'],
  //   remove_node: ['path', 'node', 'data'],
  //   set_node: ['path', 'properties', 'newProperties', 'data'],
  //   split_node: ['path', 'position', 'properties', 'target', 'data'],

  //   set_selection: ['properties', 'newProperties', 'data'],
  //   set_value: ['properties', 'newProperties', 'data'],
};

export { Transform, OperationTypes };
