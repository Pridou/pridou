export enum InterpreterValueType {
	Nil = "nil",

	Number = "Number",
	String = "String",
	Boolean = "Boolean",

	Identifier = "Identifier",
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

export interface InterpreterIdentifier extends InterpreterValue {
	type: InterpreterValueType.Identifier;
	value: string;
}
