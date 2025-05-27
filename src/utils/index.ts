export function isIdentifier(value: string): boolean {
  return /^[A-Z]$/i.test(value);
}

export function isNumber(value: string): boolean {
  return !Number.isNaN(Number.parseInt(value));
}
