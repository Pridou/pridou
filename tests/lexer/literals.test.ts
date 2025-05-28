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

  it.todo("Negative Integer", () => {
    expect(lexer.toTokens("-42")).toStrictEqual(tokens([T.Number, "-42"]));
  });

  it.todo("Negative Float", () => {
    expect(lexer.toTokens("-3.14")).toStrictEqual(tokens([T.Number, "-3.14"]));
  });

  it("Boolean true", () => {
    expect(lexer.toTokens("true")).toStrictEqual(
      tokens([T.Identifier, "true"]),
    );
  });

  it("Boolean false", () => {
    expect(lexer.toTokens("false")).toStrictEqual(
      tokens([T.Identifier, "false"]),
    );
  });

  it("Null", () => {
    expect(lexer.toTokens("null")).toStrictEqual(
      tokens([T.Identifier, "null"]),
    );
  });

  it("String", () => {
    expect(lexer.toTokens('"Im\' testing now !"')).toStrictEqual(
      tokens([T.String, "Im' testing now !"]),
    );

    expect(lexer.toTokens("'hello'")).toStrictEqual(
      tokens([T.String, "hello"]),
    );
  });

  it("Empty String", () => {
    expect(lexer.toTokens("''")).toStrictEqual(tokens([T.String, ""]));
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

  it.todo("Function", () => {
    const input = "function hello(name) { const a = name; return a; }";
    const expected = [
      t(T.Function, "function"),
      t(T.Identifier, "hello"),
      t(T.OpeningParenthesis, "("),
      t(T.Identifier, "name"),
      t(T.ClosingParenthesis, ")"),
      t(T.OpeningCurlyBracket, "{"),
      t(T.Const, "const"),
      t(T.Identifier, "a"),
      t(T.Equals, "="),
      t(T.Identifier, "name"),
      t(T.Semicolon, ";"),
      t(T.Return, "return"),
      t(T.Semicolon, ";"),
      t(T.ClosingCurlyBracket, "}"),
      EOF,
    ];

    expect(lexer.toTokens(input)).toStrictEqual(expected);
  });
});
