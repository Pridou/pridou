export default class InvalidTokenError extends Error {
	public constructor(message: string) {
		super(message);

		Object.setPrototypeOf(this, InvalidTokenError.prototype);
	}
}
