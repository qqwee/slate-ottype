import { testDoc } from './fuzzer.test';
import slateType from '../SlateType';
import { generateAndApplyRandomOp } from './op-generator';
const fuzzer = require('ot-fuzzer');

const Value = slateType.Value;
/**
 * Overload slateType create function for easier random op generation
 */
slateType.type.create = function(init) {
    console.log('called create in SlateType');
    init = testDoc;
    return Value.create(init);
};

fuzzer(slateType.type, generateAndApplyRandomOp, 100);

export const dummy = {};
