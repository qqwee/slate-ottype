/* eslint-disable */
import { Selector } from './Selector';
import { normalizeSnapShot } from './Utilitites';

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
            console.log(
                JSON.parse(JSON.stringify(Value.create(init).toJSON()))
            );
            return Value.create(init);
        },
        apply: function(snapshot, op) {
            let value = Value.create(snapshot);
            const operation = Operation.create(op);
            value = operation.apply(value);
            value = Value.create(normalizeSnapShot(value));
            return value;
        },
        transform: function(op1, op2, side) {
            op1 = Operation.create(op1);
            op2 = Operation.create(op2);
            return Selector.transform(op1, op2, side);
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
        }
        /**
         * TODO:
         *      compose operations to send them out together, at least compose for text
         *      which is the most common usage of text editor
         * @param {Operation} op1
         * @param {Operation} op2
         * compose: function (op1, op2) {

            }
         */
    }
};

export default slateType;
