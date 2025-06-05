import { InterpreterValueType, } from "../types/interpreter.js";
export const NATIVE_CONSTANTS = new Map([
    [
        "nil",
        {
            type: InterpreterValueType.Nil,
            value: null,
        },
    ],
    [
        "true",
        {
            type: InterpreterValueType.Boolean,
            value: true,
        },
    ],
    [
        "false",
        {
            type: InterpreterValueType.Boolean,
            value: false,
        },
    ],
]);
export const NATIVE_FUNCTIONS = new Map();
