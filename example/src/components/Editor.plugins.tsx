export const MarkHotKey = (options: any) => {
  const { type, key } = options;
  return {
    onKeyDown(event: any, editor: any, next: any) {
      if (event.key !== key || !event.ctrlKey) return next();
      event.preventDefault();
      editor.toggleMark(type);
    },
  };
};
