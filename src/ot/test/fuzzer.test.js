const testDoc = {
    object: 'value',
    document: {
        object: 'document',
        data: {},
        nodes: [
            {
                object: 'block',
                type: 'paragraph',
                data: {},
                nodes: [
                    {
                        object: 'text',
                        leaves: [
                            {
                                object: 'leaf',
                                text: 'A line of text in a paragraph.',
                                marks: [{ type: 'c' }, { type: 'a' }]
                            },
                            {
                                object: 'leaf',
                                text: 'Test',
                                marks: [{ type: 'a' }, { type: 'c' }]
                            }
                        ]
                    }
                ]
            }
        ]
    }
};

export { testDoc };
