import {type InterpreterNumber, type InterpreterString, type InterpreterValue, InterpreterValueType} from '@/types';

// Lexer
export function isAlpha(value: string): boolean {
  return /^[A-Z]$/i.test(value);
}

export function isNumber(value: string): boolean {
  return /^[0-9]$/.test(value);
}
export function isString(value: InterpreterValue): boolean {
  return value.type === InterpreterValueType.String;
}

export function isNumeric(value: InterpreterValue): boolean {
  return value.type === InterpreterValueType.Number ||
      value.type === InterpreterValueType.Boolean;
}

export function getString(value: InterpreterValue): string {
  return (<InterpreterString>value).value;
}

export function getNumber(value: InterpreterValue): number {
  if (value.type === InterpreterValueType.Boolean) {
    return (<any>value).value;
  }
  return (<InterpreterNumber>value).value;
}
