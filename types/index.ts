// Lexer

export enum LexerTokenType {
	Alpha =  "Alpha",
	Number = "Number",
	Float = "Float",

	Let = "Let",
	Const = "Const",
	String= "String",
	
	Equals = "Equals",
	BinaryOperator = "BinaryOperator",

	Comma = "Comma",
	Colon = "Colon",
	Semicolon = "Semicolon",

	OpeningParenthesis = "OpeningParenthesis",
	ClosingParenthesis = "ClosingParenthesis",
	OpeningCurlyBracket = "OpeningCurlyBracket",
	ClosingCurlyBracket = "ClosingCurlyBracket",
	OpeningSquareBracket = "OpeningSquareBracket",
	ClosingSquareBracket = "ClosingSquareBracket",

	EOF = "EOF",
}

export interface LexerToken {
	type: LexerTokenType;
	value: string;
}

// AST
// Parser

export enum ASTNodeType {
	Program = "Program",

	VariableDeclaration = "VariableDeclaration",
	
	Alpha = "Alpha",
	Number = "Number",

	String = "String",

	Float = "Float",
	Array = "Array",

	
	BinaryExpression = "BinaryExpression",
	AssignmentExpression = "AssignmentExpression",
}

export interface ASTStatement {
	type: ASTNodeType;
}

export interface ASTExpression extends ASTStatement {}

export interface ASTProgram extends ASTStatement {
	type: ASTNodeType.Program;
	body: ASTStatement[];
}

export interface ASTArray extends ASTStatement {
	type: ASTNodeType.Array;
	body: ASTStatement[];
}

export interface ASTVariableDeclaration extends ASTStatement {
	type: ASTNodeType.VariableDeclaration;
	alpha: string;
	value?: ASTExpression;
	metadata: {
		isConstant: boolean;
	};
}

export interface ASTAlpha extends ASTStatement {
	type: ASTNodeType.Alpha;
	value: string;
}

export interface ASTNumber extends ASTStatement {
	type: ASTNodeType.Number;
	value: number;
}

export interface ASTFloat extends ASTStatement {
	type: ASTNodeType.Float;
	value: number ;
}

export interface ASTBinaryExpression extends ASTStatement {
	type: ASTNodeType.BinaryExpression;
	binaryOperator: string;
	leftExpression: ASTExpression;
	rightExpression: ASTExpression;
}

export interface ASTAssignmentExpression extends ASTStatement {
	type: ASTNodeType.AssignmentExpression;
	value: ASTExpression,
	assignee: ASTExpression,
}

export interface ASTString extends ASTStatement {
	type: ASTNodeType.String;
	value: String;
}


// Interpreter

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
<<<<<<< HEAD
export {Config} from "@/types/config"
=======

export interface InterpreterArray extends InterpreterValue {
  type: InterpreterValueType.Array;
  elements: InterpreterValue[];
}

export interface InterpreterString extends InterpreterValue {
	type: InterpreterValueType.String;
	value: String;
}
>>>>>>> 2725173b9c80ced0ca5f7adf4b1c7dd2c226e104
