const assert = require('assert');
const fuzzer = require('ot-fuzzer');
const fs = require('fs');

const stateLogger = ({ prev, val1, val2, op1, op2 }) => {
  const content = JSON.stringify({
    prev: prev.toJSON(),
    val1: val1.toJSON(),
    val2: val2.toJSON(),
    op1: op1.toJSON(),
    op2: op2.toJSON(),
  });
  fs.writeFile('crash-report.json', content, 'utf8', function(err) {
    if (err) {
      console.log('An error occured while writing JSON Object to File.');
      return console.log(err);
    }
    console.log('Crash report has been saved.');
  });
};

export default class CustomFuzzer {
  constructor({ otType, iterations = 100, generateRandomOp } = {}) {
    this.otType = otType;
    this.iterations = iterations;
    this.generateRandomOp = generateRandomOp;

    this.initialValue = this.otType.create();

    this.start = this.start.bind(this);
    this.singleTransformCheck = this.singleTransformCheck.bind(this);
    this.checkEqual = this.checkEqual.bind(this);
  }

  /**
   * Start a new series of iterations
   */
  start() {
    let val1 = this.initialValue;
    let val2 = this.initialValue;
    let prev;

    let currentIteration = 0;
    while (currentIteration < this.iterations) {
      // keep the value of the previous iteration for debugging
      prev = val1;

      const op1 = this.generateRandomOp(val1);
      const op2 = this.generateRandomOp(val2);
      const side = fuzzer.randomInt(1) === 1 ? 'left' : 'right';
      let otherSide = side === 'left' ? 'right' : 'left';

      const apply = this.otType.apply;
      const op1Transform = this.otType.transform(op1, op2, side);
      const op2Transform = this.otType.transform(op2, op1, otherSide);

      val1 = apply(apply(val1, op1), op2Transform);
      val2 = apply(apply(val2, op2), op1Transform);

      // break early if failed
      if (!this.checkEqual(val1, val2)) {
        stateLogger({ prev, val1, val2, op1, op2 });
        return;
      }

      console.log(`========= PASSED ${currentIteration} =========`);
      currentIteration++;
    }
    console.log('PASSED ALL');
    return val1;
  }

  /**
   * Check that a single transform works
   */
  singleTransformCheck({ value = this.initialValue, op1, op2, side }) {
    const apply = this.otType.apply;
    let otherSide = side === 'left' ? 'right' : 'left';
    const op1Transform = this.otType.transform(op1, op2, side);
    const op2Transform = this.otType.transform(op2, op1, otherSide);

    const val1 = apply(apply(value, op1), op2Transform);
    const val2 = apply(apply(value, op2), op1Transform);

    return this.checkEqual(val1, val2);
  }

  /**
   * Check that two values are equal
   */
  checkEqual(val1, val2) {
    try {
      if (this.otType.serialize) {
        assert.deepStrictEqual(this.otType.serialize(val1), this.otType.serialize(val2));
      } else {
        assert.deepStrictEqual(val1, val2);
      }
      return true;
    } catch (err) {
      console.log('========= FAILED =========');
      console.log(err);
      console.log('========= VAL 1 =========');
      console.log(JSON.stringify(this.otType.serialize(val1.document), null, 2));
      console.log('========= VAL 2 =========');
      console.log(JSON.stringify(this.otType.serialize(val2.document), null, 2));
      return false;
    }
  }
}
