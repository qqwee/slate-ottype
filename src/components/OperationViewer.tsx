import React from 'react';
import {JsonTable} from 'react-json-to-html';
/*
const elementParser = (el, json, nest: number, jsonParser) => {
    if (json[el] !== 'object') {
        return (
            <div>
                <li className={`list-${nest}`}>{el}</li>
                <li className={`list-${nest + 1}`}>{json[el]}</li>
            </div>
        );
    } else {
        return (
            <div>
                <li className={`list-${nest}`}>{el}</li>
                <li className={`list-${nest + 1}`}>{jsonParser(el, nest + 1)}</li>
            </div>
        );
};
};

const generateHTML = (key, value, nest) => {
    return (
        <div>
            <li className={`key-list-${nest}`}>{key}</li>
            <li className={`value-list-${nest + 1}`}>{value}</li>
        </div>
    )
};

const jsonParser = (json, nest: number = 0) => {
    if (typeof json === 'object') {
        let jsx;
        Object.keys(json).map(key => {
            const value = json[key];
            if (typeof value !== 'object' && typeof value !== 'function') {
                return generateHTML(key, value, nest);
            } else if (Array.isArray(value)) {
                return (
                    <div>
                        <li className={`key-list-${nest}`}>{key}</li>
                        {jsonParser}
                    </div>
                );
            } else if (value === 'object') {

            }
        });



        if (Array.isArray(json)) {
            console.log('JSON PARSER isArray');
            jsx = json.map(el => {
                return elementParser(el, json, nest, jsonParser);
            })
        } else if (typeof json === 'object') {
            console.log('JSON PARSER isObject');
            jsx = Object.keys(json).map(el => {
                return elementParser(el, json, nest, jsonParser);
            });
        }
        return jsx;
    }
}*/

const OperationViewer = (props) => {
    console.log('OPsViewer:' + props.ops);
    
    // const list = props.ops.view(el => {
    //     return jsonParser(el, 0);
    // });
    const list = props.ops.view( el => {
        return (<li key={Math.random()}>{JSON.stringify(el)}</li>);
    });
    /*
    const list = props.ops.view((el: any) => {
        return (<div style={{border:'solid'}}><JsonTable json={el} /></div>); 
    });
    */
    return (<ul>{list}</ul>);
};

export default OperationViewer;