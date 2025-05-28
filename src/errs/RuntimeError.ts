export default class RuntimeError extends Error {
  public constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, RuntimeError.prototype);
  }
}
