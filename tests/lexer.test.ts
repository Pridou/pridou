import { describe, expect, it } from "vitest";
import { tokenize } from "../lib";
import { type LexerToken, LexerTokenType } from "../lib/types";

const EOF: LexerToken = {
  type: LexerTokenType.EOF,
  value: "EOF",
};

describe("Lexer", () => {
  describe("Literals", () => {
    it("Alpha", () => {
      const alpha = tokenize("a");
      const expected: LexerToken[] = [
        {
          type: LexerTokenType.Alpha,
          value: "a",
        },
        EOF,
      ];

      expect(alpha).toStrictEqual(expected);
    });

    it("Number", () => {
      const number = tokenize("10");
      const expectedNumber: LexerToken[] = [
        {
          type: LexerTokenType.Number,
          value: "10",
        },
        EOF,
      ];

      expect(number).toStrictEqual(expectedNumber);

      const float = tokenize("10.2");
      const expectedFloat: LexerToken[] = [
        {
          type: LexerTokenType.Float,
          value: "10.2",
        },
        EOF,
      ];

      expect(float).toStrictEqual(expectedFloat);
    });

    it("String", () => {
      const strings = [tokenize('"Im\' testing now !"'), tokenize("'hello'")];
      const expected: LexerToken[][] = [
        [
          {
            type: LexerTokenType.String,
            value: "Im' testing now !",
          },
          EOF,
        ],
        [
          {
            type: LexerTokenType.String,
            value: "hello",
          },
          EOF,
        ],
      ];

      expect(strings[0]).toStrictEqual(expected[0]);
      expect(strings[1]).toStrictEqual(expected[1]);
    });
  });

  describe("Variables", () => {
    it("Constant (immut)", () => {
      const immut = tokenize("const");
      const expected: LexerToken[] = [
        {
          type: LexerTokenType.Const,
          value: "const",
        },
        EOF,
      ];

      expect(immut).toStrictEqual(expected);
    });

    it("Variable (mut)", () => {
      const mut = tokenize("let");
      const expected: LexerToken[] = [
        {
          type: LexerTokenType.Let,
          value: "let",
        },
        EOF,
      ];

      expect(mut).toStrictEqual(expected);
    });
  });

  describe("Assignment and declarations", () => {
    it("Constant (immut)", () => {
      const immut = tokenize("const test;");
      const expected: LexerToken[] = [
        {
          type: LexerTokenType.Const,
          value: "const",
        },
        {
          type: LexerTokenType.Alpha,
          value: "test",
        },
        {
          type: LexerTokenType.Semicolon,
          value: ";",
        },
        EOF,
      ];

      expect(immut).toStrictEqual(expected);
    });

    it("Variable (mut)", () => {
      const mut = tokenize("let test;");
      const expected: LexerToken[] = [
        {
          type: LexerTokenType.Let,
          value: "let",
        },
        {
          type: LexerTokenType.Alpha,
          value: "test",
        },
        {
          type: LexerTokenType.Semicolon,
          value: ";",
        },
        EOF,
      ];

      expect(mut).toStrictEqual(expected);
    });
  });

  describe("Structures", () => {
    it("Array", () => {
      const array = tokenize("[1, 'hello', \"world\"]");
      const expected: LexerToken[] = [
        {
          type: LexerTokenType.OpeningSquareBracket,
          value: "[",
        },
        {
          type: LexerTokenType.Number,
          value: "1",
        },
        {
          type: LexerTokenType.Comma,
          value: ",",
        },
        {
          type: LexerTokenType.String,
          value: "hello",
        },
        {
          type: LexerTokenType.Comma,
          value: ",",
        },
        {
          type: LexerTokenType.String,
          value: "world",
        },
        {
          type: LexerTokenType.ClosingSquareBracket,
          value: "]",
        },
        EOF,
      ];

      expect(array).toStrictEqual(expected);
    });

    //TODO: Add functions
    it.skip("Function", () => {
      const func = tokenize("function hello(name) { }");
      const expected: LexerToken[] = [
        {
          type: LexerTokenType.Function,
          value: "function",
        },
        {
          type: LexerTokenType.Alpha,
          value: "hello",
        },
        {
          type: LexerTokenType.OpeningParenthesis,
          value: "(",
        },
        {
          type: LexerTokenType.Alpha,
          value: "name",
        },
        {
          type: LexerTokenType.ClosingParenthesis,
          value: ")",
        },
        {
          type: LexerTokenType.OpeningCurlyBracket,
          value: "{",
        },
        {
          type: LexerTokenType.ClosingCurlyBracket,
          value: "}",
        },
        EOF,
      ];

      expect(func).toStrictEqual(expected);
    });
  });
});
