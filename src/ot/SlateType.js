/* eslint-disable */
var { Value, Operation } = require('slate');
var { PathUtils } = require('slate');
import { Selector } from './Selector';
var { isImmutable } = require('immutable');

const slateType = {
    Value: Value,
    Operation: Operation,
    type: {
        name: 'slate-ot-type',
        uri: 'http://sharejs.org/types/slate-ot-type',
        create: function (init) {
            console.log(init);
            console.log('called create in SlateType');
            console.log(JSON.parse(JSON.stringify(Value.create(init).toJSON())));
            return Value.create(init);
        },
        apply: function (snapshot, op) {
            console.log('Apply op to snapshot');
            let value = Value.create(snapshot);
            const operation = Operation.create(op);
            value = operation.apply(value);
            return value;
        },
        transform: function (op1, op2, side) {
            console.log('transform called');
            op1 = Operation.create(op1);
            op2 = Operation.create(op2);
            if (op1.get('type') === 'insert_text' && op2.get('type') === 'insert_text') {
                console.log('insert_text transform called');
                return Selector.transform(op1, op2, side);
            }
            else if (side === 'left') {
                return op1;
            } else {
                return op2;
            }
        },
        serialize: function (snapshot) {
            console.log('serialize called: ');
            if (isImmutable(snapshot)) {
                console.log(JSON.stringify(snapshot.toJSON()));
                return snapshot.toJSON();
            } else {
                console.log(JSON.stringify(snapshot));
                return snapshot;
            }
        },
        deserialize: function (data) {
            console.log('deserialize called: ');
            console.log(JSON.stringify(data));
            return Value.fromJSON(data);
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
        
    }
};

export default slateType;
