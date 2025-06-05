export default class InvalidTokenError extends Error {
    constructor(message) {
        super(message);
        Object.setPrototypeOf(this, InvalidTokenError.prototype);
    }
}
