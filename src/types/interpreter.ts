import type Environment from "@/environment";
import type { ASTFunctionDeclaration } from "@/types/ast";

export enum InterpreterValueType {
  Null = "Null",

  Number = "Number",
  Boolean = "Boolean",

  String = "String",

  Function = "Function",
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

export interface InterpreterString extends InterpreterValue {
  type: InterpreterValueType.String;
  value: string;
}

export interface InterpreterFunction extends InterpreterValue {
  type: InterpreterValueType.Function;
  value: ASTFunctionDeclaration;
  parameters: string[];
  environment: Environment;
}
