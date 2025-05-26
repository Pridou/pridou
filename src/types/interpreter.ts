export enum InterpreterValueType {
  Null = "Null",
  Array = "Array",

  Number = "Number",
  Boolean = "Boolean",
  String = "String",
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
  value: number;
}

export interface InterpreterArray extends InterpreterValue {
  type: InterpreterValueType.Array;
  elements: InterpreterValue[];
}

export interface InterpreterString extends InterpreterValue {
  type: InterpreterValueType.String;
  value: string;
}
