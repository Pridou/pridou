export default class InvalidNodeError extends Error {
  public constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, InvalidNodeError.prototype);
  }
}
