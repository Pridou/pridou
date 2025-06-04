import {
  type InterpreterBoolean,
  type InterpreterValue,
  InterpreterValueType,
} from "@/types/interpreter";

export const NATIVE_CONSTANTS: Map<string, InterpreterValue> = new Map<
  string,
  InterpreterValue
>([
  [
    "nil",
    <InterpreterValue>{
      type: InterpreterValueType.Nil,
      value: null,
    },
  ],
  [
    "true",
    <InterpreterBoolean>{
      type: InterpreterValueType.Boolean,
      value: true,
    },
  ],
  [
    "false",
    <InterpreterBoolean>{
      type: InterpreterValueType.Boolean,
      value: false,
    },
  ],
]);

export const NATIVE_FUNCTIONS: Map<string, unknown> = new Map();
