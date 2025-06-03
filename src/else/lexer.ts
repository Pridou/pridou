import { LexerTokenType } from "@/types/lexer";

export const SKIPPED_TOKENS: Set<string> = new Set<string>([
	" ",
	"\0",
	"\b",
	"\f",
	"\n",
	"\r",
	"\t",
	"\v",
	"\\",
]);

export const CLASSIC_TOKENS: Map<string, LexerTokenType> = new Map<
	string,
	LexerTokenType
>([
	[LexerTokenType.Dot, LexerTokenType.Dot],
	[LexerTokenType.Comma, LexerTokenType.Comma],
	[LexerTokenType.Colon, LexerTokenType.Colon],
	[LexerTokenType.Semicolon, LexerTokenType.Semicolon],

	[LexerTokenType.OpeningParenthesis, LexerTokenType.OpeningParenthesis],
	[LexerTokenType.ClosingParenthesis, LexerTokenType.ClosingParenthesis],
	[LexerTokenType.OpeningCurlyBracket, LexerTokenType.OpeningCurlyBracket],
	[LexerTokenType.ClosingCurlyBracket, LexerTokenType.ClosingCurlyBracket],
	[LexerTokenType.OpeningSquareBracket, LexerTokenType.OpeningSquareBracket],
	[LexerTokenType.ClosingSquareBracket, LexerTokenType.ClosingSquareBracket],
]);

export const RESERVED_TOKENS: Map<string, LexerTokenType> = new Map<
	string,
	LexerTokenType
>([
	[LexerTokenType.Fix, LexerTokenType.Fix],
	[LexerTokenType.For, LexerTokenType.For],
	[LexerTokenType.Fun, LexerTokenType.Fun],
	[LexerTokenType.Mut, LexerTokenType.Mut],
	[LexerTokenType.Nil, LexerTokenType.Nil],
	[LexerTokenType.Ret, LexerTokenType.Ret],
	[LexerTokenType.Wil, LexerTokenType.Wil],
]);
