var { getAllTextLeafsWithPaths } = require('./fuzzer');
var { Operation } = require('slate');

const testDoc = {
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
                },
                {
                    "object": "leaf",
                    "text": "Test",
                    "marks": []
                  }
              ]
            }
          ]
        }
      ]
    }
};


module.exports = {
  testDoc
};

// console.log(getAllTextLeafsWithPaths(testDoc.document, []));

