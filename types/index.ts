import type Environment from "@/src/environment";

// Lexer

export enum LexerTokenType {
	Alpha = "Alpha",
	Number = "Number",

	Let = "Let",
	Const = "Const",
	Function = "Function",

	String = "String",

	Equals = "Equals",
	BinaryOperator = "BinaryOperator",
	ComparisonOperator = "ComparisonOperator",

	Comma = "Comma",
	Colon = "Colon",
	Semicolon = "Semicolon",
	Dot = "Dot",

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

	FunctionDeclaration = "FunctionDeclaration",
	VariableDeclaration = "VariableDeclaration",

	Alpha = "Alpha",
	Number = "Number",

	String = "String",

	Array = "Array",
	Index = "Index",


	BinaryExpression = "BinaryExpression",
	AssignmentExpression = "AssignmentExpression",

	Object = "Object",
	ObjectProperty = "ObjectProperty",
	ObjectAttribute = "Attribute"
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

export interface ASTIndex extends ASTStatement {
  type: ASTNodeType.Index;
  array: ASTExpression;
  index: ASTExpression;
}

export interface ASTFunctionDeclaration extends ASTStatement {
	type: ASTNodeType.FunctionDeclaration;
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

export interface ASTBinaryExpression extends ASTStatement {
	type: ASTNodeType.BinaryExpression;
	binaryOperator: string;
	leftExpression: ASTExpression;
	rightExpression: ASTExpression;
}

export interface ASTAssignmentExpression extends ASTStatement {
	type: ASTNodeType.AssignmentExpression;
	value: ASTExpression;
	assignee: ASTExpression;
}

export interface ASTString extends ASTStatement {
	type: ASTNodeType.String;
	value: string;
}

export interface ASTObject extends ASTStatement {
  type: ASTNodeType.Object;
  properties: { [key: string]: ASTExpression };
}

export interface ASTObjectProperty extends ASTStatement {
  type: ASTNodeType.ObjectProperty;
  key: string;
  value: ASTExpression;
}

export interface ASTObjectAttribute extends ASTStatement {
  type: ASTNodeType.ObjectAttribute;
  object: ASTExpression;
  property: ASTExpression;
}

// Interpreter

export enum InterpreterValueType {
	Null = "Null",
	Array = "Array",
	Number = "Number",
	Boolean = "Boolean",
	String = "String",
	Object = "Object"
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

export interface InterpreterObject extends InterpreterValue {
  type: InterpreterValueType.Object;
  properties: { [key: string]: InterpreterValue };
  environment: Environment;
}
