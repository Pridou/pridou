import { expect, test } from "bun:test";

import { LexerTokenType, type LexerToken } from "@/types";

import { tokenize } from "@/src/lexer";

test("1", (): void => {
	expect(tokenize("")).toEqual([]);
});

test("2", (): void => {
	expect(tokenize("const a = 1")).toEqual([
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
	]);
});
