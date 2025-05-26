export enum InterpreterValueType {
  Null = "Null",

  Number = "Number",
  Boolean = "Boolean",
}

export interface InterpreterValue {
  type: InterpreterValueType;
}

export interface InterpreterNull extends InterpreterValue {
  type: InterpreterValueType.Null;
  value: null;
}

export interface InterpreterNumber extends InterpreterValue {
  type: InterpreterValueType.Number;
  value: number;
}

export interface InterpreterBoolean extends InterpreterValue {
  type: InterpreterValueType.Boolean;
  value: boolean;
}
