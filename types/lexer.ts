export enum LexerTokenType {
	Fix = "fix",
	For = "for",
	Fun = "fun",
	Mut = "mut",
	Nil = "nil",
	Ret = "ret",
	Wil = "wil",

	Number = "Number",
	String = "String",

	Identifier = "Identifier",

	Modulus  = "%",
	Multiply = "*",
	Plus     = "+",
	Minus    = "-",
	Divide   = "/",

	Increment = "++",
	Decrement = "--",

	Assignment     = "=",
	ModulusEquals  = "%=",
	MultiplyEquals = "*=",
	PlusEquals     = "+=",
	MinusEquals    = "-=",
	DivideEquals   = "/=",

	Equality   = "==",

	LessThan    = "<",
	GreaterThan = ">",

	SingleQuote = "'",
	DoubleQuote = '"',

	// TODO: Rework
	Dot       = ".",
	Comma     = ",",
	Colon     = ":",
	Semicolon = ";",

	LeftRoundBracket   = "(",
	RightRoundBracket  = ")",
	LeftCurlyBracket   = "{",
	RightCurlyBracket  = "}",
	LeftSquareBracket  = "[",
	RightSquareBracket = "]",
}

export interface LexerToken {
	type: LexerTokenType;
	value: string;
}
