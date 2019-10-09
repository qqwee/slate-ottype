import React from 'react';
import { Value } from 'slate';
import { Editor } from 'slate-react';
import { MarkHotKey } from './Editor.plugins';
import connection from '../modules/Connetion';
import uuid4 from 'uuid4';

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
  opsChanger: (o: any) => void;
}

class EditorSlate extends React.Component<IProps, any> {
  private doc;
  private userId;
  state = {
    value: Value.create({}),
  };
  private _setDoc = () => {
    this.doc = connection.get('examples', 'richtext');
    console.log('Doc');
    console.log(this.doc);
    this.doc.subscribe(err => {
      if (err) {
        console.log('err' + err);
        throw err;
      }
      this.setState({ value: Value.create(this.doc.data) });
      console.log('Successful subscription');
      console.log(this.doc.data);
      this.doc.on('op', (op, source) => {
        console.log('incoming ops', op);
        console.log('Operation', Operation)
        if (source === this.userId) return;
        const ops = Operation.createList(op)
        ops.forEach(o => {
          this.setState({
            value: o.apply(this.state.value),
          });
        })

      });
    });
  };
  componentWillMount = () => {
    if (!this.doc) {
      this._setDoc();
    }
    if (!this.userId) {
      this.userId = uuid4();
    }
  };
  onChange = ({ value, operations }) => {
    const { opsChanger } = this.props;
    opsChanger(operations);
    operations.forEach(o => {
      if (o.type !== 'set_selection') {
        this.doc.submitOp(o.toJSON(), { source: this.userId });
      }
    });
    this.setState({ value });
  };

  onKeydown = (e, editor, next) => {
    if (e.key === 'Enter') e.preventDefault()
    else next()
  }

  render() {
    return (
      <Editor
        plugins={plugins}
        value={this.state.value}
        onChange={this.onChange}
        onKeyDown={this.onKeydown}
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

export default EditorSlate;
