import { Editor } from 'slate-react';
import { Value } from 'slate';
import React from 'react';
import { CodeNode } from './Editor.utils';
import { BoldMark } from './Editor.marks';

const initValue = Value.fromJSON({
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

// const editorStyle = {
//     height: '80vh',
//     width: '80%',
//     borderStyle: 'solid'
// };

class SlateEditor extends React.Component {
    state = {
        value: initValue,
    };
    render() {
        return (
            <Editor
                value={this.state.value}
                style={editorStyle}
                onChange={this.onChange}
                onKeyDown={this.onKeyDown}
                renderNode={this.renderNode}
                renderMark={this.renderMark}
            />
        );
    }
    onChange = ({value}) => {
        this.setState({value});
    };
    onKeyDown = (event, editor, next) => {
        if (!event.ctrlKey) {
            return next();
        }
        console.log(event.key);
        switch(event.key) {
            case 'b': {
                event.preventDefault();
                editor.toggleMark('bold');
                break;
            }
            case '`': {
                event.preventDefault();
                const isCode = editor.value.blocks.some(b => b.type === 'code');
                editor.setBlocks(isCode ? 'paragraph' : 'code');
            }
            default: {
                return next(); 
            }
        }
    }
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
                return <BoldMark {...props} />
            default:
                return next();
        }
    }

}

export default SlateEditor;