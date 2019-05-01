/* eslint-disable */
import { Selector } from './Selector';
import { normalizeSnapShot, isArray } from './Utilitites';

var { Value, Operation } = require('slate');
var { PathUtils } = require('slate');
var { isImmutable } = require('immutable');

const slateType = {
  Value: Value,
  Operation: Operation,
  type: {
    name: 'slate-ot-type',
    uri: 'http://sharejs.org/types/slate-ot-type',
    create: function(init) {
      console.log(init);
      console.log('called create in SlateType');
      console.log(JSON.parse(JSON.stringify(Value.create(init).toJSON())));
      return Value.create(init);
    },
    apply: function(snapshot, op) {
      let value = Value.create(snapshot);
      op.forEach(o => {
        const operation = Operation.create(o);
        value = operation.apply(value);
      });
      value = Value.create(normalizeSnapShot(value));
      return value;
    },
    transform: function(op1, op2, side) {
      op1 = op1.map(o => Operation.create(o));
      op2 = op2.map(o => Operation.create(o));
      return slateType.transformOpLists(op1, op2, side);
    },
    serialize: function(snapshot) {
      if (isImmutable(snapshot)) {
        return normalizeSnapShot(snapshot.toJSON());
      } else {
        return normalizeSnapShot(snapshot);
      }
    },
    deserialize: function(data) {
      return Value.fromJSON(data);
    },
    normalize: function(op) {
      return isArray(op) ? op : [op];
    },
    /**
         * TODO:
         *      compose operations to send them out together, at least compose for text
         *      which is the most common usage of text editor
         * @param {Operation} op1
         * @param {Operation} op2
         * compose: function (op1, op2) {

            }
         */
  },
};

slateType.transformOpLists = function(op1, op2, side) {
  let transformedOps = [];
  for (let i = 0; i < op1.length; i++) {
    let leftOp = op1[i];
    for (let j = 0; j < op2.length; j++) {
      const rightOp = op2[j];
      leftOp = Selector.transform(leftOp, rightOp, side);
      if (isArray(leftOp) && leftOp.length > 1) {
        leftOp = slateType.transformOpLists(leftOp, op2.slice(j), side);
        break;
      }
    }

    transformedOps = isArray(leftOp) ? [...transformedOps, ...leftOp] : [...transformedOps, leftOp];
  }

  return transformedOps;
};

export default slateType;
