import { describe, expect, it } from "vitest";
import Lexer from "../../src/lexer";
import { EOF, T, t, tokens } from "../utils/lexer";

const lexer = new Lexer();

describe("Literals", () => {
  it("Identifier", () => {
    expect(lexer.toTokens("a")).toStrictEqual(tokens([T.Identifier, "a"]));
  });

  it("Number", () => {
    expect(lexer.toTokens("10")).toStrictEqual(tokens([T.Number, "10"]));
  });

  it("Float", () => {
    expect(lexer.toTokens("10.2")).toStrictEqual(tokens([T.Number, "10.2"]));
  });

  it("String", () => {
    expect(lexer.toTokens('"Im\' testing now !"')).toStrictEqual(
      tokens([T.String, "Im' testing now !"]),
    );

    expect(lexer.toTokens("'hello'")).toStrictEqual(
      tokens([T.String, "hello"]),
    );
  });

  it("SkippedLiterals", () => {
    expect(lexer.toTokens("   \n\t  ")).toStrictEqual([EOF]);
  });
});

describe("Structures", () => {
  it("Array", () => {
    const input = "[1, 'hello', \"world\"]";
    const expected = [
      t(T.OpeningSquareBracket, "["),
      t(T.Number, "1"),
      t(T.Comma, ","),
      t(T.String, "hello"),
      t(T.Comma, ","),
      t(T.String, "world"),
      t(T.ClosingSquareBracket, "]"),
      EOF,
    ];

    expect(lexer.toTokens(input)).toStrictEqual(expected);
  });

  it("Function", () => {
    const input = "function hello(name) { }";
    const expected = [
      t(T.Function, "function"),
      t(T.Identifier, "hello"),
      t(T.OpeningParenthesis, "("),
      t(T.Identifier, "name"),
      t(T.ClosingParenthesis, ")"),
      t(T.OpeningCurlyBracket, "{"),
      t(T.ClosingCurlyBracket, "}"),
      EOF,
    ];

    expect(lexer.toTokens(input)).toStrictEqual(expected);
  });
});
