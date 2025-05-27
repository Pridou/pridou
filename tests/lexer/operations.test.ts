import { describe, expect, it } from "vitest";
import Lexer from "../../lib";
import { type LexerToken, LexerTokenType } from "../../lib/types";

const EOF: LexerToken = {
  type: LexerTokenType.EndOfFile,
  value: "EndOfFile",
};

const lexer = new Lexer();

describe("Variables", () => {
  it("Constant (immut)", () => {
    const immut = lexer.toTokens("const");
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
    const mut = lexer.toTokens("let");
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
    const immut = lexer.toTokens("const test;");
    const expected: LexerToken[] = [
      {
        type: LexerTokenType.Const,
        value: "const",
      },
      {
        type: LexerTokenType.Identifier,
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
    const mut = lexer.toTokens("let test;");
    const expected: LexerToken[] = [
      {
        type: LexerTokenType.Let,
        value: "let",
      },
      {
        type: LexerTokenType.Identifier,
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

describe("BinaryOperations", () => {
  it("Equals", () => {
    const equals = lexer.toTokens("1 == 1");
    const expected: LexerToken[] = [
      {
        type: LexerTokenType.Number,
        value: "1",
      },
      {
        type: LexerTokenType.Equals,
        value: "=",
      },
      {
        type: LexerTokenType.Equals,
        value: "=",
      },
      {
        type: LexerTokenType.Number,
        value: "1",
      },
      EOF,
    ];

    expect(equals).toStrictEqual(expected);
  });

  it("Add Numbers", () => {
    const add = lexer.toTokens("21 + 9999");
    const expected: LexerToken[] = [
      {
        type: LexerTokenType.Number,
        value: "21",
      },
      {
        type: LexerTokenType.BinaryOperator,
        value: "+",
      },
      {
        type: LexerTokenType.Number,
        value: "9999",
      },
      EOF,
    ];

    expect(add).toStrictEqual(expected);
  });

  it("Add Strings", () => {
    const addStr = lexer.toTokens('"Im\' " + "testing"');
    const expected: LexerToken[] = [
      {
        type: LexerTokenType.String,
        value: "Im' ",
      },
      {
        type: LexerTokenType.BinaryOperator,
        value: "+",
      },
      {
        type: LexerTokenType.String,
        value: "testing",
      },
      EOF,
    ];

    expect(addStr).toStrictEqual(expected);
  });
});
