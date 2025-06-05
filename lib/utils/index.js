export function isIdentifier(value) {
    return /^[A-Z]$/i.test(value);
}
export function isNumber(value) {
    return !Number.isNaN(Number.parseInt(value));
}
