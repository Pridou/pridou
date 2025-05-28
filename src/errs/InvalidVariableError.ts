export default class InvalidVariableError extends Error {
  public constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, InvalidVariableError.prototype);
  }
}
