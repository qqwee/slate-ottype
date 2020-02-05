# Data model of Slate
An example of the data model of slate, converted to JSON would look something like the following:
```
{
  "object": "value",
  "document": {
    "object": "document",
    "data": {},
    "nodes": [
      {
        "object": "block",
        "type": "paragraph",
        "data": {},
        "nodes": [
          {
            "object": "text",
            "leaves": [
              {
                "object": "leaf",
                "text": "A line of text in a paragraph.",
                "marks": []
              }
            ]
          }
        ]
      }
    ]
  }
}
```
Important to notice that all the leaf nodes are text nodes, with a field leaves.
