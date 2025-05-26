import { expect, test } from "bun:test";

import { LexerTokenType } from "@/types";

import { tokenize } from "@/src/lexer";

test("1 + 1", (): void => {
	expect(tokenize("1 + 1")).toEqual([
		{
			type: LexerTokenType.Number,
			value: "1",
		},
		{
			type: LexerTokenType.BinaryOperator,
			value: "+",
		},
		{
			type: LexerTokenType.Number,
			value: "1",
		},
		{
			type: LexerTokenType.EOF,
			value: "EOF",
		},
	]);
});

test("const a = 1;", (): void => {
	expect(tokenize("const a = 1;")).toEqual([
		{
			type: LexerTokenType.Const,
			value: "const",
		},
		{
			type: LexerTokenType.Alpha,
			value: "a",
		},
		{
			type: LexerTokenType.Equals,
			value: "=",
		},
		{
			type: LexerTokenType.Number,
			value: "1",
		},
		{
			type: LexerTokenType.Semicolon,
			value: ";",
		},
		{
			type: LexerTokenType.EOF,
			value: "EOF",
		},
	]);
});
