export function isAlpha(value: string): boolean {
  return /^[A-Z]$/i.test(value);
}

export function isNumber(value: string): boolean {
  return /^[0-9]$/.test(value);
}
