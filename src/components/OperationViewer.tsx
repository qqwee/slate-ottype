import React from 'react';

const OperationViewer = (props) => {
    console.log('OPsViewer:', props.ops);

    const list = props.ops.view(el => {
        return (<li key={Math.random()}>{JSON.stringify(el)}</li>);
    });
    return (<ul>{list}</ul>);
};

export default OperationViewer;