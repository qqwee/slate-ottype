import { Editor } from 'slate-react';
import { Value } from 'slate';
import React from 'react';
import { CodeNode } from './Editor.utils';
import { BoldMark } from './Editor.marks';
import { MarkHotKey } from './Editor.plugins';

// This is still actually quite tricky, since getItem returns string | null
// But JSON.parser only accepts string values.
const inStorage = localStorage.getItem('content');
const existingValue = JSON.parse(inStorage ? inStorage : '{}');
const initValue = Value.fromJSON(
    existingValue || {
    document: {
        nodes: [
            {
                object: 'block',
                type: 'paragraph',
                nodes: [
                    {
                        object: 'text',
                        leaves: [
                            {
                                object: 'leaf',
                                text: 'A line of text in a paragraph.',
                            },
                        ],
                    },
                ],
            },
        ],
    },
});

const plugins = [
    MarkHotKey({ key: 'b', type: 'bold' }),
    MarkHotKey({ key: '`', type: 'code' }),
    MarkHotKey({ key: 'i', type: 'italic' }),
    MarkHotKey({ key: '~', type: 'strikethrough' }),
    MarkHotKey({ key: 'u', type: 'underline' }),
  ]

class SlateEditor extends React.Component {
    state = {
        value: initValue,
    };
    render() {
        return (
            <Editor
                plugins={plugins}
                value={this.state.value}
                onChange={this.onChange}
                renderNode={this.renderNode}
                renderMark={this.renderMark}
            />
        );
    }
    onChange = ({value}) => {
        const content = JSON.stringify(value.toJSON());
        this.setState({value});
        localStorage.setItem('content', content);
    };
    renderNode = (props, editor, next) => {
        switch (props.node.type) {
            case 'code':
                return (<CodeNode {...props} />);
            default:
                return next();
        }
    };
    renderMark = (props, editor, next) => {
        switch (props.mark.type) {
            case 'bold':
                return (<strong>{props.children}</strong>);
            case 'code':
                return (<code>{props.children}</code>);
            case 'italic':
                return (<em>{props.children}</em>);
            case 'strikethrough':
                return (<del>{props.children}</del>);
            case 'underline':
                return (<u>{props.children}</u>);
            default:
                return next();
        }
    }

}

export default SlateEditor;