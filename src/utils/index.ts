export function isNumber(value: string): boolean {
	return /^[0-9]$/.test(value);
}

export function isIdentifier(value: string): boolean {
	return /^[A-Z]$/i.test(value);
}
