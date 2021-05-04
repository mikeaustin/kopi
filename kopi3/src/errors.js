class BaseError extends Error {
  constructor(message) {
    super(message);

    this.name = this.constructor.name;
  }
}

/*

SyntaxError
InternalError
TypeError
ReferenceError
RangeError

*/

class InternalError extends BaseError { }
class RuntimeError extends BaseError { }

module.exports = {
  InternalError,
  RuntimeError
};
