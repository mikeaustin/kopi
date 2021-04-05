class BaseError extends Error {
  constructor(message) {
    super(message);

    this.name = this.constructor.name;
  }
}

class InterpreterError extends BaseError { }
class RuntimeError extends BaseError { }

module.exports = {
  InterpreterError,
  RuntimeError
};
