export default class InvalidVariableError extends Error {
    constructor(message) {
        super(message);
        Object.setPrototypeOf(this, InvalidVariableError.prototype);
    }
}
