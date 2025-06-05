export default class InvalidNodeError extends Error {
    constructor(message) {
        super(message);
        Object.setPrototypeOf(this, InvalidNodeError.prototype);
    }
}
