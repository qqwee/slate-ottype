let connection = require('./Connection');

interface ShareDB {
    slate: any;
    doc: any;
}

class ShareDB {
    constructor(slate: any, options: any) {
      this.slate = slate;
      this.doc = connection.get('examples', 'richtext');
      this.setUpShareDB(this.doc, this.slate);
    }
    private setUpShareDB = (doc, slate) => {
      doc.subscribe( err => {
        if (err) throw err;
        slate.setContents(doc.data);
        slate.on('text-change', (delta, oldDelta, source) => {
          console.log(delta);
          if (source !== 'user') return;
          doc.submitOp(delta, {source: this.slate});
        });
        doc.on('op', function(op, source) {
          if (source === slate) return;
          slate.updateContents(op);
        });
      });
    }
  }

export default ShareDB;