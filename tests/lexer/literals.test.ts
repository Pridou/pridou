import { describe, expect, it } from "vitest";
import Lexer from "../../src/lexer";
import { T, t, tokens } from "../utils/lexer";

describe("Literals", () => {
  it("Identifier", () => {
    const a = new Lexer();
    expect(a.toTokens("a")).toStrictEqual(tokens([T.Identifier, "a"]));
  });

  it("Number", () => {
    const a = new Lexer();
    expect(a.toTokens("10")).toStrictEqual(tokens([T.Number, "10"]));
  });

  it("Float", () => {
    const a = new Lexer();
    expect(a.toTokens("10.2")).toStrictEqual(tokens([T.Number, "10.2"]));
  });

  it("Negative Integer", () => {
    const a = new Lexer();
    expect(a.toTokens("-42")).toStrictEqual(tokens([T.Number, "-42"]));
  });

  it("Negative Float", () => {
    const a = new Lexer();
    expect(a.toTokens("-3.14")).toStrictEqual(tokens([T.Number, "-3.14"]));
  });

  it("Plus Integer", () => {
    const a = new Lexer();
    expect(a.toTokens("+42")).toStrictEqual(tokens([T.Number, "+42"]));
  });

  it("Plus Float", () => {
    const a = new Lexer();
    expect(a.toTokens("+3.14")).toStrictEqual(tokens([T.Number, "+3.14"]));
  });

  it("Boolean true", () => {
    const a = new Lexer();
    expect(a.toTokens("true")).toStrictEqual(tokens([T.Identifier, "true"]));
  });

  it("Boolean false", () => {
    const a = new Lexer();
    expect(a.toTokens("false")).toStrictEqual(tokens([T.Identifier, "false"]));
  });

  it("Nil", () => {
    const a = new Lexer();
    expect(a.toTokens("nil")).toStrictEqual(tokens([T.Identifier, "nil"]));
  });

  it("String", () => {
    const a = new Lexer();
    const b = new Lexer();

    expect(a.toTokens('"Im\' testing now !"')).toStrictEqual(
      tokens([T.String, "Im' testing now !"]),
    );

    expect(b.toTokens("'hello'")).toStrictEqual(tokens([T.String, "hello"]));
  });

  it("Empty String", () => {
    const a = new Lexer();
    expect(a.toTokens("''")).toStrictEqual(tokens([T.String, ""]));
  });

  it("SkippedLiterals", () => {
    const a = new Lexer();
    expect(a.toTokens("   \n\t\0\b\r  ")).toStrictEqual([]);
  });
});

describe("Structures", () => {
  it("Array", () => {
    const a = new Lexer();
    const input = "[1, 'hello', \"world\"]";
    const expected = [
      t(T.LeftSquareBracket, "["),
      t(T.Number, "1"),
      t(T.Comma, ","),
      t(T.String, "hello"),
      t(T.Comma, ","),
      t(T.String, "world"),
      t(T.RightSquareBracket, "]"),
    ];

    expect(a.toTokens(input)).toStrictEqual(expected);
  });

  it("Function", () => {
    const a = new Lexer();
    const input = "fun hello(name) { mut a = name; ret a; }";
    const expected = [
      t(T.Fun, "fun"),
      t(T.Identifier, "hello"),
      t(T.LeftRoundBracket, "("),
      t(T.Identifier, "name"),
      t(T.RightRoundBracket, ")"),
      t(T.LeftCurlyBracket, "{"),
      t(T.Mut, "mut"),
      t(T.Identifier, "a"),
      t(T.Assignment, "="),
      t(T.Identifier, "name"),
      t(T.Semicolon, ";"),
      t(T.Ret, "ret"),
      t(T.Identifier, "a"),
      t(T.Semicolon, ";"),
      t(T.RightCurlyBracket, "}"),
    ];

    expect(a.toTokens(input)).toStrictEqual(expected);
  });
});
