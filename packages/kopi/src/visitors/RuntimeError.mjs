class RuntimeError extends Error {
  constructor(message, fileName, lineNumber) {
    super(message);

    this.name = 'RuntimeError';
    this.fileName = fileName;
    this.lineNumber = lineNumber;
  }
}

export default RuntimeError;
