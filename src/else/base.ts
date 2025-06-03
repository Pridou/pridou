import {
	InterpreterBoolean,
	InterpreterValue,
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
			value: InterpreterValueType.Nil,
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

export const NATIVE_FUNCTIONS: Map<string, any> = new Map();
