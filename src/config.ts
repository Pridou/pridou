// TODO: Create config

import { Config , LexerTokenType} from "@/types";


export default{
	let: LexerTokenType.Let,
	const: LexerTokenType.Const,
	string: LexerTokenType.String,
	float: LexerTokenType.Float,
	repeat: LexerTokenType.Repeat,
	print: LexerTokenType.Print,
	"=": LexerTokenType.Equals,
	"+": LexerTokenType.BinaryOperator,
	"-": LexerTokenType.BinaryOperator,
	"/": LexerTokenType.BinaryOperator,
	"*": LexerTokenType.BinaryOperator,
	"%": LexerTokenType.BinaryOperator,
	",": LexerTokenType.Comma,
	":": LexerTokenType.Colon,
	";": LexerTokenType.Semicolon,
	"(": LexerTokenType.OpeningParenthesis,
	")": LexerTokenType.ClosingParenthesis,
	"{": LexerTokenType.OpeningCurlyBracket,
	"}": LexerTokenType.ClosingCurlyBracket,
	"[": LexerTokenType.OpeningSquareBracket,
	"]": LexerTokenType.ClosingSquareBracket,
	Alpha: LexerTokenType.Alpha,
	Number: LexerTokenType.Number,
	EOF: LexerTokenType.EOF,

} as Config;