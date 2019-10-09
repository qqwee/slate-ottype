export const MarkHotKey = (options) => {
    const { type, key } = options;
    return {
        onKeyDown (event, editor, next) {
            if (event.key !== key || (!event.ctrlKey && !event.metaKey))
                return next();
            event.preventDefault();
            editor.toggleMark(type);
        },
    }

};
