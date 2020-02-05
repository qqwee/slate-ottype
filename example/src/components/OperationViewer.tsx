import React from 'react';

const OperationViewer = (props: any) => {
  console.log('OPsViewer:' + props.ops);

  const list = props.ops.view((el: any) => {
    return <li key={Math.random()}>{JSON.stringify(el)}</li>;
  });
  return <ul>{list}</ul>;
};

export default OperationViewer;
