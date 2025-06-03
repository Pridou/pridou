import {ASTNode} from "@/types/parser";

import Environment from "@/src/Environment";

export enum InterpreterValueType {
	Nil = "nil",

	Number  = "Number",
	String  = "String",
	Boolean = "Boolean",

	Function = "Function",
}

export interface InterpreterValue {
	type: InterpreterValueType;
}

export interface InterpreterNil extends InterpreterValue {
	type: InterpreterValueType.Nil;
	value: InterpreterValueType.Nil;
}

export interface InterpreterNumber extends InterpreterValue {
	type: InterpreterValueType.Number;
	value: number;
}

export interface InterpreterString extends InterpreterValue {
	type: InterpreterValueType.String;
	value: string;
}

export interface InterpreterBoolean extends InterpreterValue {
	type: InterpreterValueType.Boolean;
	value: boolean;
}

export interface InterpreterFunction extends InterpreterValue {
	type: InterpreterValueType.Function;
	body: ASTNode[];
	parameters: string[];
	environment: Environment;
}
