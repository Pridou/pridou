// Lexer

export enum LexerTokenType {

	
	
	And = "And",
	Or = "Or",
	
	BlockStatement = "BlockStatement",


	


	Alpha =  "Alpha",
	Number = "Number",

	Let = "Let",
	Const = "Const",
	
	Equals = "Equals",
	BinaryOperator = "BinaryOperator",

	Comma = "Comma",
	Colon = "Colon",
	Semicolon = "Semicolon",
	
	While = "While",

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
	
	WhileStatement = "WhileStatement",
	BlockStatement = "BlockStatement",
	
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



export interface ASTVariableDeclaration extends ASTStatement {
	type: ASTNodeType.VariableDeclaration;
	alpha: string;
	value?: ASTExpression;
	metadata: {
		isConstant: boolean;
	};
}
export interface ASTWhileStatement extends ASTStatement{
	type: ASTNodeType.WhileStatement;
	test: ASTExpression;
	body: ASTStatement;
}

export interface ASTBlockStatement extends ASTStatement{
	type: ASTNodeType.BlockStatement;
	body: ASTStatement[];
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
	value: ASTExpression,
	assignee: ASTExpression,
}

// Interpreter

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
	value: number;
}









