import React from 'react';
import { Value } from 'slate';
const { Operation } = require('slate');
import { Editor } from 'slate-react';
import HTML from 'slate-html-serializer';
import { MarkHotKey } from './Editor.plugins';
import connection from '../modules/Connetion';
import { deepEqual } from 'assert';
import uuid4 from 'uuid4';
// import { styledMenu } from './Editor.menu';

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

export const rules = [
    {
        deserialize (el, next) {
            const type = BLOCK_TAGS[el.tagName.toLowerCase()];
            if (type) {
                return {
                    object: 'block',
                    type: type,
                    data: {
                        className: el.getAttribute('class'),
                    },
                    nodes: next(el.childNodes),
                }
            }
        },
        serialize (obj, children) {
            if (obj.object === 'block') {
                switch (obj.type) {
                    case 'paragraph':
                        return <p className={obj.data.get('className')}>{children}</p>;
                    case 'quote':
                        return <blockquote>{children}</blockquote>;
                    case 'code':
                        return (
                            <pre>
                                <code>{children}</code>
                            </pre>
                        )
                }
            }
        },
    },
    {
        deserialize (el, next) {
            const type = MARK_TAGS[el.tagName.toLowerCase()];
            if (type) {
                return {
                    object: 'mark',
                    type: type,
                    nodes: next(el.childNodes),
                }
            } 
        },
        serialize (obj, children) {
            if (obj.object === 'mark') {
                switch (obj.type) {
                    case 'bold':
                        return <strong>{children}</strong>;
                    case 'italics':
                        return <em>{children}</em>;
                    case 'underline':
                        return <u>{children}</u>;
                }
            }
        }
    },
];

export const html = new HTML({rules});

const initialValue = localStorage.getItem('content') || '<p></p>';

interface IProps {
    opsChanger: (o:any) => void;
}

class EditorTestHTML extends React.Component<IProps, any>{
    private doc;
    private userId;
    state = {
        value: Value.create({}),
    }
    private _setDoc = () => {
        this.doc = connection.get('examples', 'richtext');
        console.log('Doc');
        console.log(this.doc);
        this.doc.subscribe( err => {
            if (err) {
                console.log('err' + err);
                throw err;
            }
            this.setState({value: Value.create(this.doc.data)});
            console.log('Successful subscription');
            console.log(this.doc.data);
            this.doc.on('op', (op, source) => {
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
    onChange = ({value, operations}) => {
        // console.log(value);
        // console.log(JSON.stringify(value.toJSON()));
        const { opsChanger } = this.props;
        opsChanger(operations);
        // const filteredOps = (operations as any[]).filter(e => e.type !== 'set_selection');
        // opsChanger(filteredOps);
        // let transformedValue = this.state.value;
        // operations.forEach(o => {
        //     o.apply(transformedValue);
        // });
        operations.forEach(o => {
            if (o.type !== 'set_selection') {
                this.doc.submitOp(o.toJSON(), {source: this.userId});
            }
        });
        console.log('vaue');
        console.log(JSON.parse(JSON.stringify(value.toJSON())));
        console.log('texts');
        // console.log(JSON.parse(JSON.stringify(value.document.getTexts().map(text => text.key))));
        const texts = JSON.parse(JSON.stringify(value.document.getTexts()));
        console.log();
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

    renderNode = (props, editor, next) => {
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

    renderMark = (props, editor, next) => {
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

export default EditorTestHTML;