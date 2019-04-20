import { Transform } from'./Transformation';

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

const Selector = {
    /**
     * 
     * @param {Operator} op1 
     * @param {Operator} op2 
     * @param {string} side 
     */
    transform: (op1, op2, side) => {
        if (op1.type === OperationTypes.INSERT_TEXT) {
            switch (op2.type) {
                case (OperationTypes.INSERT_TEXT):
                    return Transform.transformInsTextInsText(op1, op2, side);
                case (OperationTypes.REMOVE_TEXT):
                    return Transform.transformInsTextRemoveText(op1, op2, side);
                case (OperationTypes.ADD_MARK):
                    return Transform.transformInsTextAddMark(op1, op2, side);
                case (OperationTypes.SET_MARK):
                    return Transform.transformInsTextSetMark(op1, op2, side);
                case (OperationTypes.REMOVE_MARK):
                    return Transform.transformInsTextRemoveMark(op1, op2, side);
                case (OperationTypes.INSERT_NODE):
                    return Transform.transformInsTextInsNode(op1, op2, side);
                case (OperationTypes.MERGE_NODE):
                    return Transform.transformInsTextMergeNode(op1, op2, side);
                case (OperationTypes.MOVE_NODE):
                    return Transform.transformInsTextMoveNode(op1, op2, side);
                case (OperationTypes.REMOVE_NODE):
                    return Transform.transformInsTextRemoveNode(op1, op2, side);
                case (OperationTypes.SET_NODE):
                    return Transform.transformInsTextSetNode(op1, op2, side);
                case (OperationTypes.SPLIT_NODE):
                    return Transform.transformInsTextSplitNode(op1, op2, side);
                case (OperationTypes.SET_SELECTION):
                    return Transform.transformInsTextSetSelection(op1, op2, side);
                case (OperationTypes.SET_VALUE):
                    return Transform.transformInsTextSetValue(op1, op2, side);
                default:
                    throw new Error('Unrecognized operation type', op1.type, op2.type);
            }
        } else if (op1.type === OperationTypes.REMOVE_TEXT) {
            switch (op2.type) {
                case (OperationTypes.INSERT_TEXT):
                case (OperationTypes.REMOVE_TEXT):
                case (OperationTypes.ADD_MARK):
                case (OperationTypes.SET_MARK):
                case (OperationTypes.REMOVE_MARK):
                case (OperationTypes.INSERT_NODE):
                case (OperationTypes.MERGE_NODE):
                case (OperationTypes.MOVE_NODE):
                case (OperationTypes.REMOVE_NODE):
                case (OperationTypes.SET_NODE):
                case (OperationTypes.SPLIT_NODE):
                case (OperationTypes.SET_SELECTION):
                case (OperationTypes.SET_VALUE):
                default:
                    throw new Error('Unsupported operation type passed: ', op1.type, op2.type);
            }
        } else if (op1.type === OperationTypes.ADD_MARK) {
            switch (op2.type) {
                case (OperationTypes.INSERT_TEXT):
                    return Transform.transformAddMarkInsText(op1, op2, side);
                case (OperationTypes.ADD_MARK):
                    return Transform.transformAddMarkAddMark(op1, op2, side);
                case (OperationTypes.REMOVE_TEXT):
                case (OperationTypes.SET_MARK):
                case (OperationTypes.REMOVE_MARK):
                    return Transform.transformAddMarkRemoveMark(op1, op2, side);
                case (OperationTypes.INSERT_NODE):
                case (OperationTypes.MERGE_NODE):
                case (OperationTypes.MOVE_NODE):
                case (OperationTypes.REMOVE_NODE):
                case (OperationTypes.SET_NODE):
                case (OperationTypes.SPLIT_NODE):
                case (OperationTypes.SET_SELECTION):
                case (OperationTypes.SET_VALUE):
                default:
                    throw new Error('Unsupported operation type passed: ', op1.type, op2.type);
            }
        } else if (op1.type === OperationTypes.REMOVE_MARK) {
            switch (op2.type) {
                case (OperationTypes.INSERT_TEXT):
                    return Transform.transformRemoveMarkInsText(op1, op2, side);
                case (OperationTypes.REMOVE_TEXT):
                case (OperationTypes.ADD_MARK):
                    return Transform.transformRemoveMarkAddMark(op1, op2, side);
                case (OperationTypes.SET_MARK):
                case (OperationTypes.REMOVE_MARK):
                    return Transform.transformRemoveMarkRemoveMark(op1, op2, side);
                case (OperationTypes.INSERT_NODE):
                case (OperationTypes.MERGE_NODE):
                case (OperationTypes.MOVE_NODE):
                case (OperationTypes.REMOVE_NODE):
                case (OperationTypes.SET_NODE):
                case (OperationTypes.SPLIT_NODE):
                case (OperationTypes.SET_SELECTION):
                case (OperationTypes.SET_VALUE):
                default:
                    throw new Error('Unsupported operation type passed: ', op1.type, op2.type);
            }
        } else if (op1.type === OperationTypes.SET_MARK) {
            switch (op2.type) {
                case (OperationTypes.INSERT_TEXT):
                case (OperationTypes.REMOVE_TEXT):
                case (OperationTypes.ADD_MARK):
                case (OperationTypes.SET_MARK):
                case (OperationTypes.REMOVE_MARK):
                case (OperationTypes.INSERT_NODE):
                case (OperationTypes.MERGE_NODE):
                case (OperationTypes.MOVE_NODE):
                case (OperationTypes.REMOVE_NODE):
                case (OperationTypes.SET_NODE):
                case (OperationTypes.SPLIT_NODE):
                case (OperationTypes.SET_SELECTION):
                case (OperationTypes.SET_VALUE):
                default:
                    throw new Error('Unsupported operation type passed: ', op1.type, op2.type);
            }
        } else if (op1.type === OperationTypes.INSERT_NODE) {
            switch (op2.type) {
                case (OperationTypes.INSERT_TEXT):
                case (OperationTypes.REMOVE_TEXT):
                case (OperationTypes.ADD_MARK):
                case (OperationTypes.SET_MARK):
                case (OperationTypes.REMOVE_MARK):
                case (OperationTypes.INSERT_NODE):
                case (OperationTypes.MERGE_NODE):
                case (OperationTypes.MOVE_NODE):
                case (OperationTypes.REMOVE_NODE):
                case (OperationTypes.SET_NODE):
                case (OperationTypes.SPLIT_NODE):
                case (OperationTypes.SET_SELECTION):
                case (OperationTypes.SET_VALUE):
                default:
                    throw new Error('Unsupported operation type passed: ', op1.type, op2.type);
            }
        } else if (op1.type === OperationTypes.MERGE_NODE) {
            switch (op2.type) {
                case (OperationTypes.INSERT_TEXT):
                case (OperationTypes.REMOVE_TEXT):
                case (OperationTypes.ADD_MARK):
                case (OperationTypes.SET_MARK):
                case (OperationTypes.REMOVE_MARK):
                case (OperationTypes.INSERT_NODE):
                case (OperationTypes.MERGE_NODE):
                case (OperationTypes.MOVE_NODE):
                case (OperationTypes.REMOVE_NODE):
                case (OperationTypes.SET_NODE):
                case (OperationTypes.SPLIT_NODE):
                case (OperationTypes.SET_SELECTION):
                case (OperationTypes.SET_VALUE):
                default:
                    throw new Error('Unsupported operation type passed: ', op1.type, op2.type);
            }
        } else if (op1.type === OperationTypes.MOVE_NODE) {
            switch (op2.type) {
                case (OperationTypes.INSERT_TEXT):
                case (OperationTypes.REMOVE_TEXT):
                case (OperationTypes.ADD_MARK):
                case (OperationTypes.SET_MARK):
                case (OperationTypes.REMOVE_MARK):
                case (OperationTypes.INSERT_NODE):
                case (OperationTypes.MERGE_NODE):
                case (OperationTypes.MOVE_NODE):
                case (OperationTypes.REMOVE_NODE):
                case (OperationTypes.SET_NODE):
                case (OperationTypes.SPLIT_NODE):
                case (OperationTypes.SET_SELECTION):
                case (OperationTypes.SET_VALUE):
                default:
                    throw new Error('Unsupported operation type passed: ', op1.type, op2.type);
            }
        } else if (op1.type === OperationTypes.REMOVE_NODE) {
            switch (op2.type) {
                case (OperationTypes.INSERT_TEXT):
                case (OperationTypes.REMOVE_TEXT):
                case (OperationTypes.ADD_MARK):
                case (OperationTypes.SET_MARK):
                case (OperationTypes.REMOVE_MARK):
                case (OperationTypes.INSERT_NODE):
                case (OperationTypes.MERGE_NODE):
                case (OperationTypes.MOVE_NODE):
                case (OperationTypes.REMOVE_NODE):
                case (OperationTypes.SET_NODE):
                case (OperationTypes.SPLIT_NODE):
                case (OperationTypes.SET_SELECTION):
                case (OperationTypes.SET_VALUE):
                default:
                    throw new Error('Unsupported operation type passed: ', op1.type, op2.type);
            }
        } else if (op1.type === OperationTypes.SET_NODE) {
            switch (op2.type) {
                case (OperationTypes.INSERT_TEXT):
                case (OperationTypes.REMOVE_TEXT):
                case (OperationTypes.ADD_MARK):
                case (OperationTypes.SET_MARK):
                case (OperationTypes.REMOVE_MARK):
                case (OperationTypes.INSERT_NODE):
                case (OperationTypes.MERGE_NODE):
                case (OperationTypes.MOVE_NODE):
                case (OperationTypes.REMOVE_NODE):
                case (OperationTypes.SET_NODE):
                case (OperationTypes.SPLIT_NODE):
                case (OperationTypes.SET_SELECTION):
                case (OperationTypes.SET_VALUE):
                default:
                    throw new Error('Unsupported operation type passed: ', op1.type, op2.type);
            }
        } else if (op1.type === OperationTypes.SPLIT_NODE) {
            switch (op2.type) {
                case (OperationTypes.INSERT_TEXT):
                case (OperationTypes.REMOVE_TEXT):
                case (OperationTypes.ADD_MARK):
                case (OperationTypes.SET_MARK):
                case (OperationTypes.REMOVE_MARK):
                case (OperationTypes.INSERT_NODE):
                case (OperationTypes.MERGE_NODE):
                case (OperationTypes.MOVE_NODE):
                case (OperationTypes.REMOVE_NODE):
                case (OperationTypes.SET_NODE):
                case (OperationTypes.SPLIT_NODE):
                case (OperationTypes.SET_SELECTION):
                case (OperationTypes.SET_VALUE):
                default:
                    throw new Error('Unsupported operation type passed: ', op1.type, op2.type);
            }
        } else if (op1.type === OperationTypes.SET_SELECTION) {
            switch (op2.type) {
                case (OperationTypes.INSERT_TEXT):
                case (OperationTypes.REMOVE_TEXT):
                case (OperationTypes.ADD_MARK):
                case (OperationTypes.SET_MARK):
                case (OperationTypes.REMOVE_MARK):
                case (OperationTypes.INSERT_NODE):
                case (OperationTypes.MERGE_NODE):
                case (OperationTypes.MOVE_NODE):
                case (OperationTypes.REMOVE_NODE):
                case (OperationTypes.SET_NODE):
                case (OperationTypes.SPLIT_NODE):
                case (OperationTypes.SET_SELECTION):
                case (OperationTypes.SET_VALUE):
                default:
                    throw new Error('Unsupported operation type passed: ', op1.type, op2.type);
            }
        } else if (op1.type === OperationTypes.SET_VALUE) {
            switch (op2.type) {
                case (OperationTypes.INSERT_TEXT):
                case (OperationTypes.REMOVE_TEXT):
                case (OperationTypes.ADD_MARK):
                case (OperationTypes.SET_MARK):
                case (OperationTypes.REMOVE_MARK):
                case (OperationTypes.INSERT_NODE):
                case (OperationTypes.MERGE_NODE):
                case (OperationTypes.MOVE_NODE):
                case (OperationTypes.REMOVE_NODE):
                case (OperationTypes.SET_NODE):
                case (OperationTypes.SPLIT_NODE):
                case (OperationTypes.SET_SELECTION):
                case (OperationTypes.SET_VALUE):
                default:
                    throw new Error('Unsupported operation type passed: ', op1.type, op2.type);
            }
        } else {
            throw new Error('Unsupported operation type passed: ' + op1.type);
        }
    }
}

export {
    OperationTypes,
    Selector
};
