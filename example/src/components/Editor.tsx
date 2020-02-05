import React from 'react';
import { Value } from 'slate';
import { Editor } from 'slate-react';
import { MarkHotKey } from './Editor.plugins';
import connection from '../modules/Connetion';
import uuid4 from 'uuid';
const { Operation } = require('slate');

const plugins = [
    MarkHotKey({ key: 'b', type: 'bold' }),
    MarkHotKey({ key: '`', type: 'code' }),
    MarkHotKey({ key: 'i', type: 'italic' }),
    MarkHotKey({ key: '~', type: 'strikethrough' }),
    MarkHotKey({ key: 'u', type: 'underline' }),
];

const BLOCK_TAGS = {
    blockquote: 'quote',
    p: 'paragraph',
    pre: 'code',
};

const MARK_TAGS = {
    em: 'italic',
    strong: 'bold',
    u: 'underline',
};
interface IProps {
    opsChanger: (o:any) => void;
}

class EditorSlate extends React.Component<IProps, any>{
    private doc: any;
    private userId: any;
    state = {
        value: Value.create({}),
    }
    private _setDoc = () => {
        this.doc = connection.get('examples', 'richtext');
        console.log('Doc');
        console.log(this.doc);
        this.doc.subscribe( (err: any) => {
            if (err) {
                console.log('err' + err);
                throw err;
            }
            this.setState({value: Value.create(this.doc.data)});
            console.log('Successful subscription');
            console.log(this.doc.data);
            this.doc.on('op', (op: any, source: any) => {
                console.log('incoming ops');
                if (source === this.userId) return;
                this.setState({
                    value: Operation.create(op).apply(this.state.value),
                });
            });
          });
    }
    componentWillMount = () => {
        if (!this.doc) {
            this._setDoc();
        }
        if (!this.userId) {
            this.userId = uuid4();
        }
    };
    onChange = ({value, operations}: {value: any; operations: any}) => {
        const { opsChanger } = this.props;
        opsChanger(operations);
        operations.forEach((o: any) => {
            if (o.type !== 'set_selection') {
                this.doc.submitOp(o.toJSON(), {source: this.userId});
            }
        });
        this.setState({ value });
    }

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

    renderNode = (props: any, editor: any, next: any) => {
        switch (props.node.type) {
            case 'code':
                return (
                    <pre {...props.attributes}>
                        <code>{props.children}</code>
                    </pre>
                );
            case 'paragraph':
                return (
                    <p {...props.attributes} className={props.node.data.get('className')}>
                        {props.children}
                    </p>
                );
            case 'quote':
                return (
                    <blockquote {...props.attributes}>
                        {props.children}
                    </blockquote>
                );
            default:
                return next();
        }
    };

    renderMark = (props: any, editor: any, next: any) => {
        const { mark, attributes } = props;
        switch (mark.type) {
            case 'bold':
                return <strong {...attributes}>{props.children}</strong>;
            case 'italic':
                return <em {...attributes}>{props.children}</em>;
            case 'underline':
                return <u {...attributes}>{props.children}</u>;
            default:
                return next();
        }
    };
}

export default EditorSlate;