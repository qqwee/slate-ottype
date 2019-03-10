import React from 'react';
import { Editor } from 'slate-react';
import HTML from 'slate-html-serializer';

const BLOCK_TAGS = {
    p: 'paragraph',
    blockquote: 'quote',
    pre: 'code',
};

const MARK_TAGS = {
    em: 'italic',
    strong: 'bold',
    u: 'underline',
};

const rules = [
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
                    nodes: next(el.childNdoes),
                }
            }
        },
        serialize (obj, children) {
            console.log(children);
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
                        return <strong>children</strong>;
                    case 'italics':
                        return <em>children</em>;
                    case 'underline':
                        return <u>childrne</u>;
                }
            }
        }
    },
];

const html = new HTML({rules});

const initialValue = localStorage.getItem('content') || '<p></p>';

class EditorTestHTML extends React.Component {
    state = {
        value: html.deserialize(initialValue),
    }

    onChange = ({value}) => {
        if (value.document !== this.state.value.document) {
            console.log('Saving');
            const string = html.serialize(value);
            localStorage.setItem('content', string);
        }
        this.setState({value});
    }

    render() {
        return (
            <Editor
                value={this.state.value}
                onChange={this.onChange}
                renderNode={this.renderNode}
                renderMark={this.renderMark}
            />
        );
    }

    renderNode = (props, editor, next) => {
        console.log('We have' + props.node.type);
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