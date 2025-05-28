import { describe, expect, it } from "vitest";
import Lexer from "../../src/lexer";
import { EOF, T, t, tokens } from "../utils/lexer";

const lexer = new Lexer();
describe.todo("Statements", () => {
  it("If", () => {
    const input = "if(1 == 4) {}";
    const expected = [
      t(T.If, "if"),
      t(T.OpeningParenthesis, "("),
      t(T.Number, "1"),
      t(T.ComparisonOperator, "=="),
      t(T.Number, "4"),
      t(T.ClosingParenthesis, ")"),
      t(T.OpeningCurlyBracket, "{"),
      t(T.ClosingCurlyBracket, "}"),
      EOF,
    ];

    expect(lexer.toTokens(input)).toStrictEqual(expected);
  });

  it("If Else", () => {
    const input = "if(1 == 4) {} else {}";
    const expected = [
      t(T.If, "if"),
      t(T.OpeningParenthesis, "("),
      t(T.Number, "1"),
      t(T.ComparisonOperator, "=="),
      t(T.Number, "4"),
      t(T.ClosingParenthesis, ")"),
      t(T.OpeningCurlyBracket, "{"),
      t(T.ClosingCurlyBracket, "}"),
      t(T.Else, "else"),
      t(T.OpeningCurlyBracket, "{"),
      t(T.ClosingCurlyBracket, "}"),
      EOF,
    ];

    expect(lexer.toTokens(input)).toStrictEqual(expected);
  });

  it("For", () => {
    const input = "for(let a = 0; a < 4; a = a + 1) {a}";
    const expected = [
      t(T.For, "for"),
      t(T.OpeningParenthesis, "("),
      t(T.Let, "let"),
      t(T.Identifier, "a"),
      t(T.Equals, "="),
      t(T.Number, "0"),
      t(T.Semicolon, ";"),
      t(T.Identifier, "a"),
      t(T.ComparisonOperator, "<"),
      t(T.Number, "4"),
      t(T.Semicolon, ";"),
      t(T.Identifier, "a"),
      t(T.Equals, "="),
      t(T.Identifier, "a"),
      t(T.BinaryOperator, "+"),
      t(T.Number, "1"),
      t(T.ClosingParenthesis, ")"),
      t(T.OpeningCurlyBracket, "{"),
      t(T.Identifier, "a"),
      t(T.ClosingCurlyBracket, "}"),
      EOF,
    ];

    expect(lexer.toTokens(input)).toStrictEqual(expected);
  });

  it("While", () => {
    const input = "while(true) {const a = 2;}";
    const expected = [
      t(T.While, "while"),
      t(T.OpeningParenthesis, "("),
      t(T.Identifier, "true"),
      t(T.ClosingParenthesis, ")"),
      t(T.OpeningCurlyBracket, "{"),
      t(T.Const, "const"),
      t(T.Identifier, "a"),
      t(T.Equals, "="),
      t(T.Number, "2"),
      t(T.Semicolon, ";"),
      t(T.ClosingCurlyBracket, "}"),
      EOF,
    ];

    expect(lexer.toTokens(input)).toStrictEqual(expected);
  });
});

describe("Variables", () => {
  it("Constant (immut)", () => {
    expect(lexer.toTokens("const")).toStrictEqual(tokens([T.Const, "const"]));
  });

  it("Variable (mut)", () => {
    expect(lexer.toTokens("let")).toStrictEqual(tokens([T.Let, "let"]));
  });
});
