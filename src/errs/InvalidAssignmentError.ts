export default class InvalidAssignmentError extends Error {
	public constructor(message: string) {
		super(message);

		Object.setPrototypeOf(this, InvalidAssignmentError.prototype);
	}
}
