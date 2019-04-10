// import React from 'react';
// import ReactDOM from 'react-dom';

// export const styledMenu = {
//     padding: '8px 7px 6px',
//     position: 'absolute',
//     zIndex: 1,
//     top: '-10000px',
//     left: '-10000px',
//     marginTop: '-6px',
//     opacity: 0,
//     backgroundColor: '#222',
//     borderRadius: '4px',
//     transition: 'opacity 0.75s',
// } as React.CSSProperties;

// interface IProps {
//     className: string;
//     innerRef: any;
// }

// class HoverMenu extends React.Component<IProps, any> {  
//     render() {
//       const { className, innerRef } = this.props
//       const root = window.document.getElementById('root')
  
//       return ReactDOM.createPortal(
//         <div style={styledMenu} className={className} innerRef={innerRef}>
//             {this.renderMarkButton('bold', 'format_bold')}
//             {this.renderMarkButton('italic', 'format_italic')}
//             {this.renderMarkButton('underlined', 'format_underlined')}
//             {this.renderMarkButton('code', 'code')}
//         </div>,
//         root
//       )
//     }  
//       /**
//    * Render a mark-toggling toolbar button.
//    *
//    * @param {String} type
//    * @param {String} icon
//    * @return {Element}
//    */

//   renderMarkButton(type, icon) {
//     const { editor } = this.props
//     const { value } = editor
//     const isActive = value.activeMarks.some(mark => mark.type === type)
//     return (
//       <Button
//         reversed
//         active={isActive}
//         onMouseDown={event => this.onClickMark(event, type)}
//       >
//         <Icon>{icon}</Icon>
//       </Button>
//     )
//   }

//   /**
//    * When a mark button is clicked, toggle the current mark.
//    *
//    * @param {Event} event
//    * @param {String} type
//    */

//   onClickMark(event, type) {
//     const { editor } = this.props
//     event.preventDefault()
//     editor.toggleMark(type)
//   }
// }