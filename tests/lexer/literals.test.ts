import { describe, expect, it } from "vitest";
import Lexer from "../../lib";
import { type LexerToken, LexerTokenType } from "../../lib/types";

const EOF: LexerToken = {
  type: LexerTokenType.EndOfFile,
  value: "EndOfFile",
};

const lexer = new Lexer();

describe("Literals", () => {
  it("Alpha", () => {
    const alpha = lexer.toTokens("a");
    const expected: LexerToken[] = [
      {
        type: LexerTokenType.Identifier,
        value: "a",
      },
      EOF,
    ];

    expect(alpha).toStrictEqual(expected);
  });

  //? Maybe can be better
  it.skip("Number", () => {
    const number = lexer.toTokens("10");
    const expectedNumber: LexerToken[] = [
      {
        type: LexerTokenType.Number,
        value: "10",
      },
      EOF,
    ];

    expect(number).toStrictEqual(expectedNumber);

    const float = lexer.toTokens("10.2");
    const expectedFloat: LexerToken[] = [
      {
        type: LexerTokenType.Number,
        value: "10.2",
      },
      EOF,
    ];

    expect(float).toStrictEqual(expectedFloat);
  });

  it("String", () => {
    const strings = [
      lexer.toTokens('"Im\' testing now !"'),
      lexer.toTokens("'hello'"),
    ];
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

describe("Structures", () => {
  it("Array", () => {
    const array = lexer.toTokens("[1, 'hello', \"world\"]");
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

  it("Function", () => {
    const func = lexer.toTokens("function hello(name) { }");
    const expected: LexerToken[] = [
      {
        type: LexerTokenType.Function,
        value: "function",
      },
      {
        type: LexerTokenType.Identifier,
        value: "hello",
      },
      {
        type: LexerTokenType.OpeningParenthesis,
        value: "(",
      },
      {
        type: LexerTokenType.Identifier,
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
